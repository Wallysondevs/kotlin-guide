export default function KtorAuth() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Ktor · avancado · 11 min</div>
      <h1>Autenticação Ktor</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O plugin <code>Authentication</code> do Ktor é modular: você instala provedores (basic, JWT, session, OAuth) e protege rotas com <code>authenticate("nome")</code>. Cada provedor expõe um <code>Principal</code> tipado que você acessa via <code>call.principal&lt;T&gt;()</code> dentro do handler.</p>

<h2>Conceito</h2>
<p>A configuração vive dentro de <code>install(Authentication) { ... }</code>. Cada bloco define um <em>provider</em> nomeado, com sua própria lógica de validação.</p>

<h2>Dependências</h2>
<pre><code class="language-groovy">implementation("io.ktor:ktor-server-core:3.0.0")
implementation("io.ktor:ktor-server-netty:3.0.0")
implementation("io.ktor:ktor-server-auth:3.0.0")
implementation("io.ktor:ktor-server-auth-jwt:3.0.0")
implementation("io.ktor:ktor-server-sessions:3.0.0")</code></pre>

<h2>Basic Auth</h2>
<pre><code class="language-kotlin">install(Authentication) {
    basic("admin-only") {
        realm = "Admin"
        validate { creds -&gt;
            if (creds.name == "admin" && creds.password == "123") {
                UserIdPrincipal(creds.name)
            } else null
        }
    }
}

routing {
    authenticate("admin-only") {
        get("/admin") {
            val user = call.principal&lt;UserIdPrincipal&gt;()!!
            call.respondText("Bem-vindo \${user.name}")
        }
    }
}</code></pre>

<h2>JWT</h2>
<pre><code class="language-kotlin">val secret = System.getenv("JWT_SECRET")
val issuer = "https://meu-app.com"
val audience = "meu-app-users"
val algorithm = Algorithm.HMAC256(secret)

install(Authentication) {
    jwt("auth-jwt") {
        realm = "Acesso restrito"
        verifier(
            JWT.require(algorithm)
                .withAudience(audience)
                .withIssuer(issuer)
                .build()
        )
        validate { credential -&gt;
            val email = credential.payload.getClaim("email").asString()
            if (!email.isNullOrBlank()) JWTPrincipal(credential.payload) else null
        }
        challenge { _, _ -&gt;
            call.respond(HttpStatusCode.Unauthorized, "Token inválido ou ausente")
        }
    }
}

routing {
    post("/login") {
        val req = call.receive&lt;LoginReq&gt;()
        // valida usuário/senha contra DB...
        val token = JWT.create()
            .withAudience(audience)
            .withIssuer(issuer)
            .withClaim("email", req.email)
            .withExpiresAt(Date(System.currentTimeMillis() + 3600_000))
            .sign(algorithm)
        call.respond(mapOf("token" to token))
    }

    authenticate("auth-jwt") {
        get("/me") {
            val principal = call.principal&lt;JWTPrincipal&gt;()!!
            call.respondText("Você é \${principal.payload.getClaim("email").asString()}")
        }
    }
}</code></pre>

<h2>Sessions com cookie assinado</h2>
<pre><code class="language-kotlin">@Serializable
data class UserSession(val userId: Long, val nome: String)

install(Sessions) {
    cookie&lt;UserSession&gt;("USER_SESSION") {
        cookie.path = "/"
        cookie.httpOnly = true
        cookie.secure = true
        cookie.maxAgeInSeconds = 60L * 60 * 24 * 7
        transform(SessionTransportTransformerMessageAuthentication(secret.toByteArray()))
    }
}

install(Authentication) {
    session&lt;UserSession&gt;("auth-session") {
        validate { it }
        challenge { call.respond(HttpStatusCode.Unauthorized) }
    }
}

routing {
    post("/login-session") {
        val req = call.receive&lt;LoginReq&gt;()
        // ... validar
        call.sessions.set(UserSession(userId = 1, nome = req.email))
        call.respond(HttpStatusCode.OK)
    }

    authenticate("auth-session") {
        get("/perfil") {
            val s = call.principal&lt;UserSession&gt;()!!
            call.respondText("Olá, \${s.nome}")
        }
    }
}</code></pre>

<h2>OAuth (ex.: Google)</h2>
<pre><code class="language-kotlin">install(Authentication) {
    oauth("google-oauth") {
        urlProvider = { "https://meu-app.com/callback" }
        providerLookup = {
            OAuthServerSettings.OAuth2ServerSettings(
                name = "google",
                authorizeUrl = "https://accounts.google.com/o/oauth2/auth",
                accessTokenUrl = "https://oauth2.googleapis.com/token",
                requestMethod = HttpMethod.Post,
                clientId = System.getenv("GOOGLE_CLIENT_ID"),
                clientSecret = System.getenv("GOOGLE_CLIENT_SECRET"),
                defaultScopes = listOf("openid", "email", "profile")
            )
        }
        client = HttpClient(CIO)
    }
}</code></pre>

<h2>Boas práticas</h2>
<ul>
<li>Nunca commit do segredo JWT — sempre via env var ou secret manager.</li>
<li>Use <code>httpOnly</code> + <code>secure</code> em cookies de sessão. Considere <code>SameSite=Lax</code>.</li>
<li>Tokens curtos (15-60 min) + refresh token guardado em cookie httpOnly.</li>
<li>Combine <code>authenticate("a", "b")</code> para aceitar múltiplos provedores na mesma rota.</li>
<li>Para roles, decodifique a claim no <code>validate</code> e crie um <code>Principal</code> próprio com a lista de papéis.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">JWT não é sessão</div><div>Token JWT não pode ser revogado facilmente. Para logout real, use uma blacklist no Redis ou prefira sessões server-side com cookie.</div></div>
`}} />
    </article>
  );
}
