import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Spring Boot · avancado · 12 min"}),e.jsx("h1",{children:"JWT com Spring"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>JWT (JSON Web Token) é o padrão para autenticação stateless em APIs REST. No Spring Security 6+ a configuração é via <code>SecurityFilterChain</code> + <code>OncePerRequestFilter</code>. Vamos cobrir geração com <strong>jjwt</strong>, validação por filter, refresh token e claims customizados.</p>

<h2>Dependências</h2>
<pre><code class="language-groovy">// build.gradle.kts
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // jjwt 0.12.x — API moderna
    implementation("io.jsonwebtoken:jjwt-api:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.5")
}</code></pre>

<h2>Serviço de token</h2>
<pre><code class="language-kotlin">import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService(
    @Value("\${jwt.secret}") secret: String,
    @Value("\${jwt.access-ttl-min}") private val accessTtlMin: Long = 15,
    @Value("\${jwt.refresh-ttl-day}") private val refreshTtlDay: Long = 30,
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray())

    fun gerarAccess(usuario: String, roles: List&lt;String&gt;): String =
        Jwts.builder()
            .subject(usuario)
            .claim("roles", roles)
            .claim("type", "access")
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + accessTtlMin * 60_000))
            .signWith(key)
            .compact()

    fun gerarRefresh(usuario: String): String =
        Jwts.builder()
            .subject(usuario)
            .claim("type", "refresh")
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + refreshTtlDay * 86_400_000))
            .signWith(key)
            .compact()

    fun validar(token: String): Claims? = runCatching {
        Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token).payload
    }.getOrNull()
}

typealias Claims = io.jsonwebtoken.Claims</code></pre>

<h2>Filter de autenticação</h2>
<pre><code class="language-kotlin">import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwt: JwtService,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        chain: FilterChain,
    ) {
        val header = request.getHeader("Authorization")
        if (header?.startsWith("Bearer ") == true) {
            val token = header.removePrefix("Bearer ")
            val claims = jwt.validar(token)
            if (claims != null &amp;&amp; claims["type"] == "access") {
                @Suppress("UNCHECKED_CAST")
                val roles = (claims["roles"] as? List&lt;String&gt; ?: emptyList())
                    .map { SimpleGrantedAuthority("ROLE_$it") }
                val auth = UsernamePasswordAuthenticationToken(claims.subject, null, roles)
                SecurityContextHolder.getContext().authentication = auth
            }
        }
        chain.doFilter(request, response)
    }
}</code></pre>

<h2>Configuração do Security</h2>
<pre><code class="language-kotlin">import org.springframework.context.annotation.*
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
class SecurityConfig(private val jwtFilter: JwtAuthenticationFilter) {

    @Bean
    fun chain(http: HttpSecurity): SecurityFilterChain = http
        .csrf { it.disable() }
        .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
        .authorizeHttpRequests {
            it.requestMatchers("/auth/**", "/health").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
        }
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter::class.java)
        .build()
}</code></pre>

<h2>Controller de login e refresh</h2>
<pre><code class="language-kotlin">@RestController
@RequestMapping("/auth")
class AuthController(
    private val jwt: JwtService,
    private val users: UserService,
    private val encoder: PasswordEncoder,
) {
    data class LoginReq(val usuario: String, val senha: String)
    data class TokenResp(val access: String, val refresh: String)
    data class RefreshReq(val refresh: String)

    @PostMapping("/login")
    fun login(@RequestBody req: LoginReq): TokenResp {
        val u = users.findByUsername(req.usuario) ?: throw BadCredentials()
        if (!encoder.matches(req.senha, u.passwordHash)) throw BadCredentials()
        return TokenResp(
            access  = jwt.gerarAccess(u.username, u.roles),
            refresh = jwt.gerarRefresh(u.username),
        )
    }

    @PostMapping("/refresh")
    fun refresh(@RequestBody req: RefreshReq): TokenResp {
        val claims = jwt.validar(req.refresh) ?: throw BadCredentials()
        if (claims["type"] != "refresh") throw BadCredentials()
        val u = users.findByUsername(claims.subject) ?: throw BadCredentials()
        return TokenResp(
            access  = jwt.gerarAccess(u.username, u.roles),
            refresh = jwt.gerarRefresh(u.username),
        )
    }
}</code></pre>

<h2>Boas práticas</h2>
<ul>
  <li>Access token curto (5–15 min); refresh token longo (dias/semanas) e armazenado em <strong>HttpOnly cookie</strong> ou local seguro do client.</li>
  <li>Mantenha <strong>blacklist de refresh tokens</strong> revogados (Redis com TTL).</li>
  <li>Use HMAC (HS256) para sistemas internos; <strong>RS256</strong> (assinatura assimétrica) quando vários serviços validam mas só um emite.</li>
  <li>Nunca armazene dados sensíveis em claims — JWT é apenas codificado em Base64, não criptografado.</li>
  <li>Inclua <code>jti</code> (id único) e <code>iss</code>/<code>aud</code> para auditoria e segregação por ambiente.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Segredo</div><div>O segredo HS256 deve ter pelo menos 256 bits (32 bytes). Gere com <code>openssl rand -base64 64</code> e injete via env var, NUNCA hard-coded.</div></div>

<div class="callout callout-tip"><div class="callout-title">Alternativa oficial</div><div>Para OAuth2/OIDC completo, considere <code>spring-boot-starter-oauth2-resource-server</code>: já valida JWT por JWKS e integra com Keycloak/Auth0/Cognito sem boilerplate.</div></div>
`}})]})}export{s as default};
