import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Projetos · avancado · 14 min"}),e.jsx("h1",{children:"Projeto: GraphQL com graphql-kotlin"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Vamos construir um servidor GraphQL em Kotlin usando o <strong>graphql-kotlin</strong> da Expedia, que adota a abordagem <em>code-first</em>: o schema GraphQL é gerado a partir de classes Kotlin via reflexão. Inclui queries, mutations, dataloaders e o suficiente para entender federação.</p>

<h2>Estrutura do projeto</h2>
<pre><code class="language-bash">graphql-app/
├── build.gradle.kts
├── settings.gradle.kts
└── src/main/kotlin/com/exemplo/
    ├── Application.kt
    ├── model/
    │   ├── Autor.kt
    │   └── Livro.kt
    ├── repo/
    │   ├── AutorRepo.kt
    │   └── LivroRepo.kt
    ├── schema/
    │   ├── LivroQuery.kt
    │   ├── LivroMutation.kt
    │   └── AutorDataLoader.kt
    └── resources/application.yml
</code></pre>

<h2>build.gradle.kts</h2>
<pre><code class="language-kotlin">plugins {
    kotlin("jvm") version "2.0.20"
    kotlin("plugin.spring") version "2.0.20"
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
}

repositories { mavenCentral() }

dependencies {
    implementation("com.expediagroup:graphql-kotlin-spring-server:8.2.1")
    implementation("com.expediagroup:graphql-kotlin-federated-hooks-provider:8.2.1")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

kotlin { jvmToolchain(21) }
</code></pre>

<h2>application.yml</h2>
<pre><code class="language-yaml">graphql:
  packages:
    - "com.exemplo.schema"
    - "com.exemplo.model"
  endpoint: "/graphql"
  graphiql:
    enabled: true
</code></pre>

<h2>Modelos</h2>
<pre><code class="language-kotlin">// model/Autor.kt
package com.exemplo.model

data class Autor(val id: Int, val nome: String)

// model/Livro.kt
package com.exemplo.model

data class Livro(
    val id: Int,
    val titulo: String,
    val autorId: Int,
)
</code></pre>

<h2>Repositórios em memória</h2>
<pre><code class="language-kotlin">package com.exemplo.repo

import com.exemplo.model.*
import org.springframework.stereotype.Component
import java.util.concurrent.atomic.AtomicInteger

@Component
class LivroRepo {
    private val seq = AtomicInteger(2)
    private val data = mutableMapOf(
        1 to Livro(1, "Kotlin in Action", 1),
        2 to Livro(2, "Effective Kotlin", 2),
    )

    fun findAll(): List&lt;Livro&gt; = data.values.toList()
    fun findById(id: Int): Livro? = data[id]
    fun add(titulo: String, autorId: Int): Livro {
        val id = seq.incrementAndGet()
        return Livro(id, titulo, autorId).also { data[id] = it }
    }
}

@Component
class AutorRepo {
    private val data = mapOf(
        1 to Autor(1, "Dmitry Jemerov"),
        2 to Autor(2, "Marcin Moskala"),
    )
    fun findByIds(ids: Set&lt;Int&gt;): Map&lt;Int, Autor&gt; =
        ids.mapNotNull { data[it] }.associateBy { it.id }
}
</code></pre>

<h2>Queries, mutations e DataLoader</h2>
<pre><code class="language-kotlin">// schema/LivroQuery.kt
package com.exemplo.schema

import com.expediagroup.graphql.server.operations.Query
import com.exemplo.model.Livro
import com.exemplo.repo.LivroRepo
import org.springframework.stereotype.Component

@Component
class LivroQuery(private val repo: LivroRepo) : Query {
    fun livros(): List&lt;Livro&gt; = repo.findAll()
    fun livro(id: Int): Livro? = repo.findById(id)
}

// schema/LivroMutation.kt
package com.exemplo.schema

import com.expediagroup.graphql.server.operations.Mutation
import com.exemplo.model.Livro
import com.exemplo.repo.LivroRepo
import org.springframework.stereotype.Component

@Component
class LivroMutation(private val repo: LivroRepo) : Mutation {
    fun adicionarLivro(titulo: String, autorId: Int): Livro =
        repo.add(titulo, autorId)
}
</code></pre>
<pre><code class="language-kotlin">// schema/AutorDataLoader.kt — evita N+1 ao resolver autor de cada livro
package com.exemplo.schema

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import com.exemplo.model.Autor
import com.exemplo.repo.AutorRepo
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class AutorDataLoader(private val repo: AutorRepo) : KotlinDataLoader&lt;Int, Autor?&gt; {
    override val dataLoaderName = "AutorDataLoader"
    override fun getDataLoader(graphQLContext: Map&lt;*, Any&gt;) =
        DataLoaderFactory.newDataLoader&lt;Int, Autor?&gt;({ ids -&gt;
            CompletableFuture.supplyAsync {
                val mapa = repo.findByIds(ids.toSet())
                ids.map { mapa[it] }
            }
        }, DataLoaderOptions.newOptions())
}
</code></pre>

<h2>Como rodar</h2>
<pre><code class="language-bash">./gradlew bootRun

# Acesse o GraphiQL em http://localhost:8080/graphiql
# Exemplo de query:
# {
#   livros { id titulo autorId }
# }
</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>BFF (Backend for Frontend) que agrega múltiplos serviços em um único endpoint.</li>
<li>APIs públicas onde clientes precisam de flexibilidade de campos.</li>
<li>Federação: várias subgraphs (cada microserviço expõe seu pedaço) compostas via Apollo Router ou GraphQL Mesh.</li>
<li>Substituir REST quando há super/subqueries muito divergentes entre clientes.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Use DataLoaders para <strong>todo</strong> resolver que faria query repetida — evita N+1 sempre.</li>
<li>Limite profundidade e complexidade da query com <code>graphql-java-extended-validation</code>.</li>
<li>Versione via deprecação de campos, não via novos endpoints.</li>
<li>Em federação, mantenha cada subgraph dono exclusivo dos seus tipos; use <code>@key</code> e referências.</li>
<li>Nunca exponha exceções cruas — mapeie para erros GraphQL com mensagens limpas via <code>DataFetcherExceptionResolver</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Para gerar e versionar o SDL automaticamente em CI, use <code>graphql-kotlin-maven-plugin</code> ou o equivalente Gradle (<code>graphqlGenerateSDL</code>). Assim você detecta breaking changes antes do deploy.</div></div>
`}})]})}export{i as default};
