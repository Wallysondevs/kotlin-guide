export default function SpringSecurity() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Spring Boot · avancado · 12 min</div>
      <h1>Spring Security</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Spring Security é a camada de autenticação e autorização padrão do ecossistema Spring. Desde a versão 6, a configuração migrou para a <strong>lambda DSL</strong> usando <code>SecurityFilterChain</code>, e o uso a partir do Kotlin é especialmente ergonômico.</p>

<h2>Conceito</h2>
<p>Você define um <code>SecurityFilterChain</code> como bean. Cada chain configura: matchers de URL, regras de autorização, mecanismos de login (form, basic, JWT), CSRF, sessões, CORS e exception handling.</p>

<pre><code class="language-kotlin">@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests {
                it.requestMatchers("/", "/public/**", "/health").permitAll()
                it.requestMatchers("/admin/**").hasRole("ADMIN")
                it.anyRequest().authenticated()
            }
            .formLogin { it.loginPage("/login").permitAll() }
            .logout { it.logoutSuccessUrl("/") }
            .csrf { it.ignoringRequestMatchers("/api/**") }
        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}</code></pre>

<h2>UserDetailsService customizado</h2>
<pre><code class="language-kotlin">@Service
class AppUserDetailsService(
    private val users: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val u = users.findByEmail(username)
            ?: throw UsernameNotFoundException(username)
        return User.builder()
            .username(u.email)
            .password(u.passwordHash)
            .roles(*u.roles.toTypedArray())
            .build()
    }
}</code></pre>

<h2>Hash de senha com BCrypt</h2>
<pre><code class="language-kotlin">@Service
class AccountService(
    private val users: UserRepository,
    private val encoder: PasswordEncoder
) {
    fun signUp(email: String, raw: String) {
        require(raw.length &gt;= 8) { "senha curta" }
        users.save(UserEntity(
            email = email,
            passwordHash = encoder.encode(raw),
            roles = setOf("USER")
        ))
    }
}</code></pre>

<div class="callout callout-warn"><div class="callout-title">Nunca armazene senhas em texto puro</div><div>BCrypt já inclui salt e custo configurável. Em produção, use <code>BCryptPasswordEncoder(12)</code> ou superior. Argon2id é alternativa moderna.</div></div>

<h2>Exemplo prático: API stateless com JWT</h2>
<pre><code class="language-kotlin">@Configuration
@EnableWebSecurity
class JwtSecurityConfig(
    private val jwtFilter: JwtAuthFilter
) {

    @Bean
    fun chain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers("/auth/**").permitAll()
                it.requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                it.anyRequest().authenticated()
            }
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter::class.java)
            .exceptionHandling {
                it.authenticationEntryPoint { _, res, _ -&gt;
                    res.status = 401
                    res.writer.write("""{"error":"unauthorized"}""")
                }
            }
        return http.build()
    }
}</code></pre>

<h2>Method security</h2>
<pre><code class="language-kotlin">@Configuration
@EnableMethodSecurity
class MethodSecurityConfig

@Service
class OrderService {
    @PreAuthorize("hasRole('ADMIN') or #ownerEmail == authentication.name")
    fun cancelOrder(id: Long, ownerEmail: String) { /* ... */ }
}</code></pre>

<h2>CSRF</h2>
<ul>
  <li>Habilitado por padrão para form-login. Desabilite apenas para APIs stateless com token.</li>
  <li>Para SPAs no mesmo domínio, use cookie CSRF: <code>http.csrf { it.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) }</code>.</li>
  <li>Endpoints chamados por webhooks externos podem ser excluídos com <code>ignoringRequestMatchers</code>.</li>
</ul>

<h2>Quando usar cada estratégia</h2>
<ul>
  <li><strong>Form login + sessão</strong>: app web tradicional, mesmo domínio.</li>
  <li><strong>Basic auth</strong>: APIs internas atrás de gateway/VPN.</li>
  <li><strong>JWT stateless</strong>: APIs públicas para SPAs/mobile.</li>
  <li><strong>OAuth2 Resource Server</strong>: integração com IdP externo (Keycloak, Auth0, Cognito).</li>
  <li><strong>OAuth2 Client</strong>: login social ("Sign in with Google").</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>A ordem dos <code>requestMatchers</code> importa — do mais específico ao mais geral.</li>
  <li><code>hasRole("ADMIN")</code> espera autoridade <code>ROLE_ADMIN</code>; já <code>hasAuthority("ADMIN")</code> não adiciona prefixo.</li>
  <li>Em controllers de testes, use <code>@WithMockUser</code> ou <code>@WithUserDetails</code>.</li>
  <li>CSRF + Postman: precisa enviar token; em dev, considere desabilitar em endpoints específicos.</li>
  <li>Mudanças no <code>SecurityFilterChain</code> exigem refresh do contexto — invalide caches de auth.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Debugging</div><div>Habilite <code>logging.level.org.springframework.security=DEBUG</code> em dev. Você verá exatamente qual filtro decidiu negar a requisição.</div></div>

<div class="callout callout-info"><div class="callout-title">OAuth2 Resource Server</div><div>Para validar JWTs emitidos por um IdP, use <code>http.oauth2ResourceServer { it.jwt { } }</code> + <code>spring.security.oauth2.resourceserver.jwt.issuer-uri=...</code>. Spring busca as JWKs e valida automaticamente.</div></div>
`}} />
    </article>
  );
}
