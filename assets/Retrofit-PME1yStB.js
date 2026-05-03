import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function a(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Android · intermediario · 10 min"}),e.jsx("h1",{children:"Retrofit + OkHttp + Moshi"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>O trio <strong>Retrofit + OkHttp + Moshi</strong> (ou kotlinx.serialization) é o padrão de fato para chamadas HTTP em Android Kotlin: declarativo, integrado a coroutines via <code>suspend</code>, e altamente extensível com interceptors.</p>

<h2>Conceito</h2>
<p>Você declara uma <em>interface</em> com anotações de rota; o Retrofit gera a implementação em runtime. O OkHttp cuida do transporte (pool de conexões, retry, cache). O Moshi/kotlinx-serialization converte JSON ↔ classes Kotlin.</p>
<pre><code class="language-groovy">// build.gradle.kts
dependencies {
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-moshi:2.11.0")
    implementation("com.squareup.moshi:moshi-kotlin:1.15.1")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
}</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">import retrofit2.http.*
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

data class Repo(val id: Long, val name: String, val stargazersCount: Int)

interface GitHubApi {
    @GET("users/{user}/repos")
    suspend fun repos(@Path("user") user: String): List&lt;Repo&gt;

    @POST("user/repos")
    suspend fun criar(@Body novo: Repo): Repo
}

fun buildApi(token: String): GitHubApi {
    val client = OkHttpClient.Builder()
        .addInterceptor { chain -&gt;
            val req = chain.request().newBuilder()
                .header("Authorization", "Bearer \\$token")
                .build()
            chain.proceed(req)
        }
        .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
        .build()

    val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()

    return Retrofit.Builder()
        .baseUrl("https://api.github.com/")
        .client(client)
        .addConverterFactory(MoshiConverterFactory.create(moshi))
        .build()
        .create(GitHubApi::class.java)
}

class ReposVm(private val api: GitHubApi) {
    suspend fun carregar(user: String): Result&lt;List&lt;Repo&gt;&gt; = runCatching {
        api.repos(user)
    }
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Consumir REST APIs JSON em apps Android.</li>
<li>Adicionar autenticação automática (Bearer, OAuth refresh) via interceptor.</li>
<li>Logging condicional em debug builds.</li>
<li>Mock/teste com OkHttp <code>MockWebServer</code>.</li>
<li>Cache HTTP transparente com <code>Cache</code> do OkHttp.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Sempre use <code>suspend</code>; <code>Call</code> e <code>RxJava</code> são legados.</li>
<li>Mapeie erros de rede em <code>sealed class</code> de domínio (Loading/Success/Error).</li>
<li>Não esqueça de configurar timeouts — defaults do OkHttp podem ser muito altos.</li>
<li>Para imagens, use Coil; Retrofit serve dados, não bytes binários grandes.</li>
<li>Em multimódulo, esconda Retrofit atrás de uma interface de repositório.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">kotlinx.serialization</div><div>Prefira <code>retrofit2-kotlinx-serialization-converter</code> com <code>@Serializable</code> nas data classes. Sem reflexão, menor APK e melhor com R8.</div></div>

<div class="callout callout-warn"><div class="callout-title">Logging em produção</div><div>Nunca deixe <code>HttpLoggingInterceptor.Level.BODY</code> em release — vaza tokens e PII para o logcat.</div></div>
`}})]})}export{a as default};
