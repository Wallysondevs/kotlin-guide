import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coroutines · avancado · 10 min"}),e.jsx("h1",{children:"Exceções em coroutines"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Em coroutines, exceções não-cancelamento <strong>propagam pela hierarquia de jobs</strong> e podem cancelar pais e irmãos. Tratar isso bem exige distinguir <code>launch</code> vs <code>async</code>, entender <code>SupervisorJob</code>/<code>supervisorScope</code> e tomar cuidado especial com <code>CancellationException</code>.</p>

<h2>Conceito</h2>
<p>A regra fundamental: em um <code>coroutineScope</code>, se uma criança falha, o pai cancela todas as outras crianças e re-lança a exceção. Em um <code>supervisorScope</code>, falhas de uma criança não afetam as irmãs.</p>

<pre><code class="language-kotlin">coroutineScope {
    launch { faz1() }   // se falhar, a próxima é cancelada
    launch { faz2() }
}

supervisorScope {
    launch { faz1() }   // falhas isoladas
    launch { faz2() }
}</code></pre>

<h2>launch vs async</h2>
<p><code>launch</code> propaga a exceção imediatamente para o pai (e para o <code>CoroutineExceptionHandler</code>, se houver). <code>async</code> guarda a exceção no <code>Deferred</code> — ela só é re-lançada quando você chama <code>await()</code>.</p>

<pre><code class="language-kotlin">// launch — try/catch interno funciona; sem catch, sobe pro pai
launch {
    try {
        operacaoQuePodeFalhar()
    } catch (e: IOException) {
        log.error("falhou", e)
    }
}

// async — try/catch precisa envolver o await
val deferred = async { operacaoQuePodeFalhar() }
try {
    val r = deferred.await()
} catch (e: IOException) {
    log.error("falhou", e)
}</code></pre>

<h2>CoroutineExceptionHandler</h2>
<p>Handler global, instalado no contexto, captura exceções <em>não tratadas</em> em <code>launch</code> da raiz (e de filhas dentro de <code>supervisorScope</code>):</p>
<pre><code class="language-kotlin">val handler = CoroutineExceptionHandler { ctx, e -&gt;
    log.error("coroutine \${ctx[CoroutineName]} estourou: \${e.message}", e)
}

val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default + handler)

scope.launch(CoroutineName("worker")) {
    error("boom")   // capturado pelo handler
}</code></pre>

<p>Importante: o handler <strong>não</strong> captura exceções de <code>async</code> — elas ficam no <code>Deferred</code> até <code>await()</code>.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">suspend fun carregarPerfil(userId: Long): PerfilCompleto = supervisorScope {
    val usuario = async { api.usuario(userId) }
    val pedidos = async {
        try { api.pedidos(userId) } catch (e: IOException) { emptyList() }
    }
    val foto = async {
        try { api.foto(userId) } catch (e: Exception) { fotoPadrao() }
    }
    PerfilCompleto(
        usuario = usuario.await(),  // se falhar, propaga
        pedidos = pedidos.await(),
        foto = foto.await(),
    )
}</code></pre>

<h2>CancellationException é especial</h2>
<ul>
  <li><code>CancellationException</code> sinaliza cancelamento <em>cooperativo</em> — não deve ser tratada como erro.</li>
  <li>Capturar e <strong>engolir</strong> <code>CancellationException</code> quebra o cancelamento; sempre re-lance.</li>
  <li>Funções suspensivas checam cancelamento em pontos de suspensão; em loops CPU-bound, chame <code>ensureActive()</code>.</li>
</ul>

<pre><code class="language-kotlin">try {
    fazerTrabalho()
} catch (e: CancellationException) {
    throw e                    // sempre re-lance
} catch (e: Exception) {
    log.error("falhou", e)
}</code></pre>

<h2>Casos de uso</h2>
<ul>
  <li>Telas que carregam várias fontes em paralelo e toleram falha parcial — <code>supervisorScope</code> + <code>async</code> com try/catch local.</li>
  <li>Workers de fila: handler global para reportar a observability (Sentry, OpenTelemetry).</li>
  <li>Pipelines críticos onde uma falha deve cancelar tudo — <code>coroutineScope</code> sem supervisor.</li>
  <li>Retry com timeout: combinar <code>withTimeout</code> + <code>retry</code> tratando <code>TimeoutCancellationException</code>.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Não capture Throwable cego</div><div><code>catch (e: Throwable)</code> em coroutine engole <code>CancellationException</code> e cria zumbis. Capture exceções específicas, e se precisar de <code>Throwable</code>, re-lance <code>CancellationException</code> explicitamente.</div></div>

<h2>Boas práticas</h2>
<ul>
  <li>Para escopos de aplicação (Android ViewModel, servidor), use <code>SupervisorJob</code> + <code>CoroutineExceptionHandler</code>.</li>
  <li>Trate erros o mais perto possível da chamada — try/catch dentro do <code>async { ... }</code> evita propagação indesejada.</li>
  <li>Logue exceções com o nome da coroutine (<code>CoroutineName</code>) para rastrear.</li>
  <li>Em testes, use <code>runTest</code> e cheque <code>uncaughtExceptions</code> do scheduler.</li>
  <li>Evite engolir exceções com <code>runCatching</code> sem checar <code>CancellationException</code>; <code>kotlinx.coroutines</code> oferece a extension <code>runCatching</code> própria que respeita cancelamento.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Regra de ouro</div><div>Pense na hierarquia: filhos de <code>coroutineScope</code> "afundam juntos"; filhos de <code>supervisorScope</code> "afundam sozinhos". Escolha conforme a semântica de negócio, não por reflexo.</div></div>
`}})]})}export{i as default};
