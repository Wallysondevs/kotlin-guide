export default function ProjetoAndroidTodo() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Projetos · avancado · 14 min</div>
      <h1>Projeto: Todo app Android</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Vamos construir um app Android completo de tarefas usando o stack moderno: <strong>Jetpack Compose</strong> para UI, <strong>ViewModel</strong> + StateFlow para apresentação, <strong>Room</strong> para persistência local, <strong>Hilt</strong> para injeção de dependências, <strong>Navigation Compose</strong> para fluxo entre telas e testes Compose para validação.</p>

<h2>Estrutura do projeto</h2>
<pre><code class="language-bash">todo/
├── build.gradle.kts
├── settings.gradle.kts
└── app/
    ├── build.gradle.kts
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml
        │   └── java/com/example/todo/
        │       ├── TodoApp.kt
        │       ├── data/
        │       │   ├── TodoEntity.kt
        │       │   ├── TodoDao.kt
        │       │   ├── TodoDatabase.kt
        │       │   └── TodoRepository.kt
        │       ├── di/
        │       │   └── AppModule.kt
        │       ├── ui/
        │       │   ├── MainActivity.kt
        │       │   ├── TodoNavHost.kt
        │       │   ├── list/
        │       │   │   ├── TodoListScreen.kt
        │       │   │   └── TodoListViewModel.kt
        │       │   └── edit/
        │       │       ├── TodoEditScreen.kt
        │       │       └── TodoEditViewModel.kt
        │       └── theme/
        │           └── Theme.kt
        ├── androidTest/java/com/example/todo/
        │   └── TodoListScreenTest.kt
        └── test/java/com/example/todo/
            └── TodoListViewModelTest.kt</code></pre>

<h2>build.gradle.kts (módulo app)</h2>
<pre><code class="language-groovy">plugins {
    id("com.android.application")
    kotlin("android")
    kotlin("kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.example.todo"
    compileSdk = 34
    defaultConfig {
        applicationId = "com.example.todo"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "com.example.todo.HiltTestRunner"
    }
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.14" }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.06.00")
    implementation(composeBom)
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.9.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.2")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.2")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    implementation("com.google.dagger:hilt-android:2.51")
    kapt("com.google.dagger:hilt-compiler:2.51")
    implementation("androidx.hilt:hilt-navigation-compose:1.2.0")

    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")

    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.1")
    androidTestImplementation(composeBom)
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    androidTestImplementation("com.google.dagger:hilt-android-testing:2.51")
    kaptAndroidTest("com.google.dagger:hilt-compiler:2.51")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}</code></pre>

<h2>Camada de dados (Room)</h2>
<pre><code class="language-kotlin">@Entity(tableName = "todos")
data class TodoEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val titulo: String,
    val concluida: Boolean = false,
    val criadoEm: Long = System.currentTimeMillis()
)

@Dao
interface TodoDao {
    @Query("SELECT * FROM todos ORDER BY criadoEm DESC")
    fun observeAll(): Flow&lt;List&lt;TodoEntity&gt;&gt;

    @Insert
    suspend fun insert(t: TodoEntity): Long

    @Update
    suspend fun update(t: TodoEntity)

    @Query("DELETE FROM todos WHERE id = :id")
    suspend fun delete(id: Long)
}

@Database(entities = [TodoEntity::class], version = 1)
abstract class TodoDatabase : RoomDatabase() {
    abstract fun todoDao(): TodoDao
}

class TodoRepository @Inject constructor(private val dao: TodoDao) {
    val all: Flow&lt;List&lt;TodoEntity&gt;&gt; = dao.observeAll()
    suspend fun add(titulo: String) = dao.insert(TodoEntity(titulo = titulo))
    suspend fun toggle(t: TodoEntity) = dao.update(t.copy(concluida = !t.concluida))
    suspend fun remove(id: Long) = dao.delete(id)
}</code></pre>

<h2>Hilt module</h2>
<pre><code class="language-kotlin">@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides @Singleton
    fun provideDb(@ApplicationContext ctx: Context): TodoDatabase =
        Room.databaseBuilder(ctx, TodoDatabase::class.java, "todo.db").build()

    @Provides
    fun provideDao(db: TodoDatabase): TodoDao = db.todoDao()
}

@HiltAndroidApp
class TodoApp : Application()</code></pre>

<h2>ViewModel e UI Compose</h2>
<pre><code class="language-kotlin">@HiltViewModel
class TodoListViewModel @Inject constructor(
    private val repo: TodoRepository
) : ViewModel() {

    val state: StateFlow&lt;List&lt;TodoEntity&gt;&gt; = repo.all
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun adicionar(titulo: String) = viewModelScope.launch {
        if (titulo.isNotBlank()) repo.add(titulo.trim())
    }
    fun alternar(t: TodoEntity) = viewModelScope.launch { repo.toggle(t) }
    fun remover(id: Long) = viewModelScope.launch { repo.remove(id) }
}

@Composable
fun TodoListScreen(vm: TodoListViewModel = hiltViewModel()) {
    val items by vm.state.collectAsStateWithLifecycle()
    var texto by rememberSaveable { mutableStateOf("") }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Row {
            OutlinedTextField(
                value = texto,
                onValueChange = { texto = it },
                modifier = Modifier.weight(1f),
                label = { Text("Nova tarefa") }
            )
            Button(onClick = { vm.adicionar(texto); texto = "" }) {
                Text("Adicionar")
            }
        }
        LazyColumn(Modifier.padding(top = 16.dp)) {
            items(items, key = { it.id }) { t -&gt;
                ListItem(
                    headlineContent = { Text(t.titulo) },
                    leadingContent = {
                        Checkbox(checked = t.concluida, onCheckedChange = { vm.alternar(t) })
                    },
                    trailingContent = {
                        IconButton(onClick = { vm.remover(t.id) }) {
                            Icon(Icons.Default.Delete, contentDescription = "remover")
                        }
                    }
                )
            }
        }
    }
}</code></pre>

<h2>Navigation</h2>
<pre><code class="language-kotlin">@Composable
fun TodoNavHost(nav: NavHostController = rememberNavController()) {
    NavHost(nav, startDestination = "list") {
        composable("list") { TodoListScreen() }
        composable("edit/{id}",
            arguments = listOf(navArgument("id") { type = NavType.LongType })
        ) { TodoEditScreen() }
    }
}

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(s: Bundle?) {
        super.onCreate(s)
        setContent { TodoTheme { TodoNavHost() } }
    }
}</code></pre>

<h2>Testes Compose</h2>
<pre><code class="language-kotlin">@HiltAndroidTest
class TodoListScreenTest {
    @get:Rule(order = 0) val hilt = HiltAndroidRule(this)
    @get:Rule(order = 1) val compose = createAndroidComposeRule&lt;HiltTestActivity&gt;()

    @Test fun adicionarTarefa_apareceNaLista() {
        compose.onNodeWithText("Nova tarefa").performTextInput("comprar pão")
        compose.onNodeWithText("Adicionar").performClick()
        compose.onNodeWithText("comprar pão").assertIsDisplayed()
    }
}</code></pre>

<h2>Como rodar</h2>
<pre><code class="language-bash"># dependências
sdkmanager "platforms;android-34" "build-tools;34.0.0"

# instalar e abrir
./gradlew :app:installDebug
adb shell am start -n com.example.todo/.ui.MainActivity

# testes unitários
./gradlew :app:testDebugUnitTest

# testes de instrumentação (com emulador rodando)
./gradlew :app:connectedDebugAndroidTest</code></pre>

<h2>Boas práticas aplicadas</h2>
<ul>
  <li><strong>Single source of truth</strong>: Room é a fonte; UI observa via Flow.</li>
  <li><strong>Unidirectional data flow</strong>: eventos sobem (UI → VM); estado desce (VM → UI).</li>
  <li><strong>Hilt</strong> isola criação de objetos e facilita troca de implementações nos testes.</li>
  <li><strong>StateFlow</strong> com <code>WhileSubscribed</code> economiza recursos quando ninguém observa.</li>
  <li><strong>Keys em LazyColumn</strong> para reciclar itens corretamente.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Próximos passos</div><div>Adicione filtros (todas/pendentes/concluídas), persistência de tema (Datastore Preferences), sincronização com backend via Ktor Client, e widget na home screen.</div></div>

<div class="callout callout-warn"><div class="callout-title">Cuidado em testes</div><div>Sempre injete um <code>TodoDatabase</code> in-memory (<code>Room.inMemoryDatabaseBuilder</code>) nos testes — banco real polui estado e quebra paralelismo.</div></div>
`}} />
    </article>
  );
}
