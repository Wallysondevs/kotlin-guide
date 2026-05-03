export default function RoomDb() {
    return (
      <article className="chapter max-w-3xl mx-auto px-6 py-10">
        <div className="text-xs text-muted-foreground mb-2 font-mono">Android · intermediario · 11 min</div>
        <h1>Room database</h1>
        <div dangerouslySetInnerHTML={{__html: `
  <p>Room é a camada de persistência oficial do Android sobre SQLite. Em Kotlin, brilha pela integração com coroutines (<code>suspend</code>) e <code>Flow</code>, oferecendo queries reativas sem boilerplate.</p>

  <h2>Conceito</h2>
  <p>Três anotações principais: <code>@Entity</code> (tabela), <code>@Dao</code> (queries) e <code>@Database</code> (configuração). O processamento de anotações usa <strong>KSP</strong> (mais rápido que KAPT em Kotlin moderno).</p>
  <pre><code class="language-groovy">// build.gradle.kts (módulo app)
  plugins {
      id("com.android.application")
      kotlin("android")
      id("com.google.devtools.ksp") version "2.0.20-1.0.25"
  }
  dependencies {
      val room = "2.6.1"
      implementation("androidx.room:room-runtime:$room")
      implementation("androidx.room:room-ktx:$room")
      ksp("androidx.room:room-compiler:$room")
  }</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">import androidx.room.*
  import kotlinx.coroutines.flow.Flow

  @Entity(tableName = "tarefas")
  data class Tarefa(
      @PrimaryKey(autoGenerate = true) val id: Long = 0,
      val titulo: String,
      val feita: Boolean = false,
  )

  @Dao
  interface TarefaDao {
      @Query("SELECT * FROM tarefas ORDER BY id DESC")
      fun observar(): Flow&lt;List&lt;Tarefa&gt;&gt;

      @Query("SELECT * FROM tarefas WHERE id = :id")
      suspend fun porId(id: Long): Tarefa?

      @Insert(onConflict = OnConflictStrategy.REPLACE)
      suspend fun salvar(tarefa: Tarefa): Long

      @Delete
      suspend fun remover(tarefa: Tarefa)
  }

  @Database(entities = [Tarefa::class], version = 2, exportSchema = true)
  abstract class AppDb : RoomDatabase() {
      abstract fun tarefas(): TarefaDao
  }</code></pre>

  <p>Migration entre versões:</p>
  <pre><code class="language-kotlin">val MIG_1_2 = object : Migration(1, 2) {
      override fun migrate(db: SupportSQLiteDatabase) {
          db.execSQL("ALTER TABLE tarefas ADD COLUMN feita INTEGER NOT NULL DEFAULT 0")
      }
  }

  Room.databaseBuilder(context, AppDb::class.java, "app.db")
      .addMigrations(MIG_1_2)
      .build()</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li>Cache local de dados de API (offline-first).</li>
  <li>Apps com formulários/listas persistidas localmente.</li>
  <li>Quando precisar de queries SQL com type-safety.</li>
  <li>Integração natural com Jetpack Compose via <code>collectAsStateWithLifecycle()</code>.</li>
  </ul>

  <h2>Boas práticas</h2>
  <ul>
  <li>Sempre <code>exportSchema = true</code> e versionar JSONs em <code>app/schemas/</code>.</li>
  <li>Nunca exponha o <code>RoomDatabase</code> diretamente; use Repository.</li>
  <li>Funções <code>suspend</code> rodam em <code>Dispatchers.IO</code> automaticamente.</li>
  <li>Flow só emite quando os dados mudam — combine com <code>distinctUntilChanged()</code> se necessário.</li>
  <li>Para testes, use <code>Room.inMemoryDatabaseBuilder</code>.</li>
  </ul>

  <div class="callout callout-tip"><div class="callout-title">Dica</div><div>Migrações destrutivas (<code>fallbackToDestructiveMigration()</code>) são aceitáveis em dev, mas <strong>nunca</strong> em produção: você apaga dados dos usuários. Sempre escreva <code>Migration</code> manual.</div></div>
  `}} />
      </article>
    );
  }
  