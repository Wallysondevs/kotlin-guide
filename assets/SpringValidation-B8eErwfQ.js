import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Spring Boot · intermediario · 8 min"}),o.jsx("h1",{children:"Validation com Bean Validation"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Spring Boot integra <strong>Jakarta Bean Validation</strong> (antiga JSR-380) por meio do starter <code>spring-boot-starter-validation</code>. Anotando seus DTOs com <code>@NotBlank</code>, <code>@Email</code>, etc., e marcando o parâmetro com <code>@Valid</code>, o framework valida antes do método rodar e devolve 400 com detalhes do erro.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">// build.gradle.kts
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
}
</code></pre>
<p>As anotações vêm do pacote <code>jakarta.validation.constraints</code> (Spring Boot 3+). No Spring Boot 2.x, era <code>javax.validation</code>.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">package com.exemplo.api

import jakarta.validation.Valid
import jakarta.validation.constraints.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

data class CriarUsuarioRequest(
    @field:NotBlank(message = "nome é obrigatório")
    @field:Size(min = 2, max = 80)
    val nome: String,

    @field:Email(message = "email inválido")
    val email: String,

    @field:Min(18) @field:Max(120)
    val idade: Int,
)

data class UsuarioResponse(val id: Long, val nome: String)

@RestController
@RequestMapping("/usuarios")
class UsuarioController {

    @PostMapping
    fun criar(@Valid @RequestBody req: CriarUsuarioRequest): ResponseEntity&lt;UsuarioResponse&gt; {
        val resp = UsuarioResponse(id = 1, nome = req.nome)
        return ResponseEntity.ok(resp)
    }
}
</code></pre>

<h2>Tratando erros de validação</h2>
<pre><code class="language-kotlin">import org.springframework.http.HttpStatus
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.*

data class ErroCampo(val campo: String, val mensagem: String?)
data class ErroResposta(val status: Int, val erros: List&lt;ErroCampo&gt;)

@RestControllerAdvice
class ValidationHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun onValidation(ex: MethodArgumentNotValidException): ErroResposta {
        val erros = ex.bindingResult.fieldErrors.map {
            ErroCampo(it.field, it.defaultMessage)
        }
        return ErroResposta(400, erros)
    }
}
</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Validar payloads de POST/PUT antes que cheguem ao service.</li>
<li>Validar query params com <code>@Validated</code> no controller + <code>@Min</code>/<code>@Max</code> direto no parâmetro.</li>
<li>Validar nested DTOs anotando o campo com <code>@field:Valid</code>.</li>
<li>Compor restrições com <code>@field:Pattern(regexp = ...)</code> para CPF, CEP, etc.</li>
<li>Validações customizadas implementando <code>ConstraintValidator</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Em Kotlin, <strong>sempre</strong> use o prefixo <code>@field:</code> nas anotações de constraint em propriedades de <code>data class</code>. Sem ele, a anotação vai para o getter ou parâmetro do construtor, e o Hibernate Validator não a vê.</li>
<li>Esquecer <code>@Valid</code> no parâmetro do controller faz o Spring ignorar todas as validações silenciosamente.</li>
<li>Para validar nested: <code>@field:Valid val endereco: Endereco</code>.</li>
<li>Tipos primitivos não-nuláveis em Kotlin não aceitam <code>@NotNull</code> (já são obrigatórios pelo tipo).</li>
<li>Em respostas, prefira retornar <code>application/problem+json</code> (RFC 7807) — o Spring 6 já tem <code>ProblemDetail</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Info</div><div>O Spring valida em ordem: primeiro deserialização Jackson (tipo errado vira <code>HttpMessageNotReadableException</code>), depois Bean Validation. Trate as duas exceções no <code>@RestControllerAdvice</code>.</div></div>
`}})]})}export{t as default};
