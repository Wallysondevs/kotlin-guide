export default function AndroidIntro() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Android · iniciante · 9 min</div>
      <h1>Android com Kotlin</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Desde 2019, o Google declarou Kotlin como linguagem de primeira classe no Android. Hoje, mais de 95% dos apps no Top 1000 usam Kotlin, e a documentação oficial (<em>Modern Android Development</em>) assume Kotlin + Jetpack Compose como stack padrão.</p>

<h2>Conceito</h2>
<p>Um projeto Android moderno tem essas peças principais:</p>
<ul>
<li><strong>Android Studio</strong> — IDE oficial baseada no IntelliJ, com emulador e ferramentas de profiling.</li>
<li><strong>Gradle + AGP</strong> (Android Gradle Plugin) — sistema de build.</li>
<li><strong>AndroidX</strong> — bibliotecas de suporte unificadas, sob o namespace <code>androidx.*</code>.</li>
<li><strong>KTX</strong> — extensões idiomáticas em Kotlin sobre as APIs do Android (<code>core-ktx</code>, <code>lifecycle-ktx</code>, <code>fragment-ktx</code>).</li>
<li><strong>Jetpack Compose</strong> — UI declarativa, sucessor das XMLs e Views.</li>
</ul>

<h2>Estrutura de um projeto novo</h2>
<pre><code class="language-bash">meu-app/
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/exemplo/MainActivity.kt
│       └── res/
│           ├── layout/        (XMLs — opcional se for tudo Compose)
│           ├── values/strings.xml
│           └── drawable/
├── build.gradle.kts            (raiz)
├── settings.gradle.kts
└── gradle/libs.versions.toml
</code></pre>

<h2>Exemplo prático: Activity com Compose</h2>
<pre><code class="language-kotlin">// app/build.gradle.kts (essencial)
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.exemplo"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.exemplo"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
    buildFeatures { compose = true }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.activity:activity-compose:1.9.2")
    implementation(platform("androidx.compose:compose-bom:2024.09.00"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
}
</code></pre>
<pre><code class="language-kotlin">package com.exemplo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                var contador by remember { mutableStateOf(0) }
                Column(Modifier.padding(24.dp)) {
                    Text("Cliques: \${contador}", style = MaterialTheme.typography.headlineSmall)
                    Spacer(Modifier.height(16.dp))
                    Button(onClick = { contador++ }) { Text("Clique") }
                }
            }
        }
    }
}
</code></pre>

<h2>Activity/Fragment vs Compose</h2>
<ul>
<li><strong>Activity/Fragment + XML</strong>: paradigma clássico imperativo, ainda dominante em apps legados.</li>
<li><strong>Jetpack Compose</strong>: paradigma declarativo, recomendado para novos apps. Convive com Views via <code>ComposeView</code> e <code>AndroidView</code>.</li>
<li><code>ComponentActivity</code> é a base mínima recomendada para apps Compose-only.</li>
<li>Fragments continuam úteis quando há backstack complexa ou DeepLinks — mas Compose Navigation cobre a maioria dos casos.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Cuidado com o ciclo de vida: nunca segure referência longa para Activity (use <code>viewModelScope</code> + StateFlow).</li>
<li><code>minSdk</code> baixo demais limita as APIs disponíveis; 24 (Android 7) é um bom compromisso atual.</li>
<li>Evite <code>android.support.*</code> — está deprecated há anos. Tudo é <code>androidx.*</code>.</li>
<li>Não rode I/O na main thread: use <code>Dispatchers.IO</code> dentro de corrotinas.</li>
<li>Ative R8 (<code>isMinifyEnabled = true</code>) em release para reduzir tamanho do APK e ofuscar.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Comece projetos novos com o template <em>Empty Compose Activity</em> do Android Studio. Ele já vem com Material3, BOM, e configuração mínima funcional.</div></div>
`}} />
    </article>
  );
}
