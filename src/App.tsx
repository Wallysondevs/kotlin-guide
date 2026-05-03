import { useState, lazy, Suspense } from "react";
  import { Switch, Route, Router as WouterRouter } from "wouter";
  import { useHashLocation } from "wouter/use-hash-location";
  import { Sidebar } from "@/components/layout/Sidebar";
  import { Header } from "@/components/layout/Header";
  import Home from "@/pages/Home";
  import NotFound from "@/pages/NotFound";

  const OQueEKotlin = lazy(() => import("@/pages/OQueEKotlin"));
const HistoriaJvm = lazy(() => import("@/pages/HistoriaJvm"));
const InstalarKotlin = lazy(() => import("@/pages/InstalarKotlin"));
const KotlinCli = lazy(() => import("@/pages/KotlinCli"));
const Repl = lazy(() => import("@/pages/Repl"));
const PrimeiroProjeto = lazy(() => import("@/pages/PrimeiroProjeto"));
const GradleBasico = lazy(() => import("@/pages/GradleBasico"));
const IntellijConfig = lazy(() => import("@/pages/IntellijConfig"));
const VariaveisValVar = lazy(() => import("@/pages/VariaveisValVar"));
const TiposBasicos = lazy(() => import("@/pages/TiposBasicos"));
const Operadores = lazy(() => import("@/pages/Operadores"));
const StringsTemplates = lazy(() => import("@/pages/StringsTemplates"));
const ControleFluxo = lazy(() => import("@/pages/ControleFluxo"));
const WhenExpression = lazy(() => import("@/pages/WhenExpression"));
const Ranges = lazy(() => import("@/pages/Ranges"));
const Loops = lazy(() => import("@/pages/Loops"));
const Funcoes = lazy(() => import("@/pages/Funcoes"));
const FuncoesDefaultNamed = lazy(() => import("@/pages/FuncoesDefaultNamed"));
const Lambdas = lazy(() => import("@/pages/Lambdas"));
const HigherOrder = lazy(() => import("@/pages/HigherOrder"));
const NullSafety = lazy(() => import("@/pages/NullSafety"));
const OperadorElvis = lazy(() => import("@/pages/OperadorElvis"));
const SafeCall = lazy(() => import("@/pages/SafeCall"));
const NotNullAssertion = lazy(() => import("@/pages/NotNullAssertion"));
const LetAlsoRunApply = lazy(() => import("@/pages/LetAlsoRunApply"));
const Classes = lazy(() => import("@/pages/Classes"));
const Construtores = lazy(() => import("@/pages/Construtores"));
const Propriedades = lazy(() => import("@/pages/Propriedades"));
const Heranca = lazy(() => import("@/pages/Heranca"));
const Interfaces = lazy(() => import("@/pages/Interfaces"));
const ClassesAbstratas = lazy(() => import("@/pages/ClassesAbstratas"));
const DataClass = lazy(() => import("@/pages/DataClass"));
const SealedClass = lazy(() => import("@/pages/SealedClass"));
const EnumClass = lazy(() => import("@/pages/EnumClass"));
const ObjectSingleton = lazy(() => import("@/pages/ObjectSingleton"));
const CompanionObject = lazy(() => import("@/pages/CompanionObject"));
const InnerNested = lazy(() => import("@/pages/InnerNested"));
const ExtensionFunctions = lazy(() => import("@/pages/ExtensionFunctions"));
const InfixFunctions = lazy(() => import("@/pages/InfixFunctions"));
const OperatorOverload = lazy(() => import("@/pages/OperatorOverload"));
const InlineFunctions = lazy(() => import("@/pages/InlineFunctions"));
const Tailrec = lazy(() => import("@/pages/Tailrec"));
const FuncoesLocais = lazy(() => import("@/pages/FuncoesLocais"));
const TypeAlias = lazy(() => import("@/pages/TypeAlias"));
const ValueClass = lazy(() => import("@/pages/ValueClass"));
const Listas = lazy(() => import("@/pages/Listas"));
const Sets = lazy(() => import("@/pages/Sets"));
const Mapas = lazy(() => import("@/pages/Mapas"));
const MutableImmutable = lazy(() => import("@/pages/MutableImmutable"));
const OperacoesFuncionais = lazy(() => import("@/pages/OperacoesFuncionais"));
const Sequences = lazy(() => import("@/pages/Sequences"));
const GroupBy = lazy(() => import("@/pages/GroupBy"));
const MapFilterReduce = lazy(() => import("@/pages/MapFilterReduce"));
const FlatMap = lazy(() => import("@/pages/FlatMap"));
const Arrays = lazy(() => import("@/pages/Arrays"));
const IntroCoroutines = lazy(() => import("@/pages/IntroCoroutines"));
const CoroutineBuilders = lazy(() => import("@/pages/CoroutineBuilders"));
const CoroutineContext = lazy(() => import("@/pages/CoroutineContext"));
const Dispatchers = lazy(() => import("@/pages/Dispatchers"));
const AsyncAwait = lazy(() => import("@/pages/AsyncAwait"));
const Flows = lazy(() => import("@/pages/Flows"));
const StateFlow = lazy(() => import("@/pages/StateFlow"));
const SharedFlow = lazy(() => import("@/pages/SharedFlow"));
const Channels = lazy(() => import("@/pages/Channels"));
const ExceptionHandlingCoroutines = lazy(() => import("@/pages/ExceptionHandlingCoroutines"));
const Generics = lazy(() => import("@/pages/Generics"));
const Variance = lazy(() => import("@/pages/Variance"));
const StarProjection = lazy(() => import("@/pages/StarProjection"));
const ReifiedTypes = lazy(() => import("@/pages/ReifiedTypes"));
const Reflexao = lazy(() => import("@/pages/Reflexao"));
const Annotations = lazy(() => import("@/pages/Annotations"));
const TypeSafeBuilders = lazy(() => import("@/pages/TypeSafeBuilders"));
const ContextReceivers = lazy(() => import("@/pages/ContextReceivers"));
const Delegates = lazy(() => import("@/pages/Delegates"));
const Excecoes = lazy(() => import("@/pages/Excecoes"));
const TryCatch = lazy(() => import("@/pages/TryCatch"));
const ResultClass = lazy(() => import("@/pages/ResultClass"));
const RunCatching = lazy(() => import("@/pages/RunCatching"));
const Junit5 = lazy(() => import("@/pages/Junit5"));
const Kotest = lazy(() => import("@/pages/Kotest"));
const Mockk = lazy(() => import("@/pages/Mockk"));
const CoroutineTesting = lazy(() => import("@/pages/CoroutineTesting"));
const PropertyBased = lazy(() => import("@/pages/PropertyBased"));
const Coverage = lazy(() => import("@/pages/Coverage"));
const GradleKts = lazy(() => import("@/pages/GradleKts"));
const Maven = lazy(() => import("@/pages/Maven"));
const Ktlint = lazy(() => import("@/pages/Ktlint"));
const Detekt = lazy(() => import("@/pages/Detekt"));
const Dokka = lazy(() => import("@/pages/Dokka"));
const Multiplataforma = lazy(() => import("@/pages/Multiplataforma"));
const KotlinScript = lazy(() => import("@/pages/KotlinScript"));
const PublicarLib = lazy(() => import("@/pages/PublicarLib"));
const SpringSetup = lazy(() => import("@/pages/SpringSetup"));
const SpringControllers = lazy(() => import("@/pages/SpringControllers"));
const SpringServices = lazy(() => import("@/pages/SpringServices"));
const SpringDataJpa = lazy(() => import("@/pages/SpringDataJpa"));
const SpringValidation = lazy(() => import("@/pages/SpringValidation"));
const SpringSecurity = lazy(() => import("@/pages/SpringSecurity"));
const SpringJwt = lazy(() => import("@/pages/SpringJwt"));
const SpringTesting = lazy(() => import("@/pages/SpringTesting"));
const SpringWebflux = lazy(() => import("@/pages/SpringWebflux"));
const SpringActuator = lazy(() => import("@/pages/SpringActuator"));
const KtorSetup = lazy(() => import("@/pages/KtorSetup"));
const KtorRouting = lazy(() => import("@/pages/KtorRouting"));
const KtorContentNegotiation = lazy(() => import("@/pages/KtorContentNegotiation"));
const KtorAuth = lazy(() => import("@/pages/KtorAuth"));
const KtorDatabase = lazy(() => import("@/pages/KtorDatabase"));
const KtorWebsockets = lazy(() => import("@/pages/KtorWebsockets"));
const KtorClient = lazy(() => import("@/pages/KtorClient"));
const KtorTesting = lazy(() => import("@/pages/KtorTesting"));
const ExposedOrm = lazy(() => import("@/pages/ExposedOrm"));
const Jdbi = lazy(() => import("@/pages/Jdbi"));
const R2dbc = lazy(() => import("@/pages/R2dbc"));
const Flyway = lazy(() => import("@/pages/Flyway"));
const PostgresConexao = lazy(() => import("@/pages/PostgresConexao"));
const MongodbDriver = lazy(() => import("@/pages/MongodbDriver"));
const AndroidIntro = lazy(() => import("@/pages/AndroidIntro"));
const ActivitiesFragments = lazy(() => import("@/pages/ActivitiesFragments"));
const JetpackCompose = lazy(() => import("@/pages/JetpackCompose"));
const ComposeState = lazy(() => import("@/pages/ComposeState"));
const ComposeNavigation = lazy(() => import("@/pages/ComposeNavigation"));
const Viewmodel = lazy(() => import("@/pages/Viewmodel"));
const RoomDb = lazy(() => import("@/pages/RoomDb"));
const Retrofit = lazy(() => import("@/pages/Retrofit"));
const HiltDi = lazy(() => import("@/pages/HiltDi"));
const AndroidCoroutines = lazy(() => import("@/pages/AndroidCoroutines"));
const KmpIntro = lazy(() => import("@/pages/KmpIntro"));
const KmpShared = lazy(() => import("@/pages/KmpShared"));
const ComposeMultiplatform = lazy(() => import("@/pages/ComposeMultiplatform"));
const InteropJava = lazy(() => import("@/pages/InteropJava"));
const InteropJs = lazy(() => import("@/pages/InteropJs"));
const Native = lazy(() => import("@/pages/Native"));
const Serialization = lazy(() => import("@/pages/Serialization"));
const Ktorm = lazy(() => import("@/pages/Ktorm"));
const ProjetoCli = lazy(() => import("@/pages/ProjetoCli"));
const ProjetoRestApi = lazy(() => import("@/pages/ProjetoRestApi"));
const ProjetoGraphql = lazy(() => import("@/pages/ProjetoGraphql"));
const ProjetoAndroidTodo = lazy(() => import("@/pages/ProjetoAndroidTodo"));
const ProjetoSpringFullstack = lazy(() => import("@/pages/ProjetoSpringFullstack"));
const ProjetoMicroservico = lazy(() => import("@/pages/ProjetoMicroservico"));

  function Loading() {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
      <WouterRouter hook={useHashLocation}>
        <div className="flex min-h-screen bg-background">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col min-w-0">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1">
              <Suspense fallback={<Loading />}>
                <Switch>
                  <Route path="/" component={Home} />
          <Route path="/o-que-e-kotlin" component={OQueEKotlin} />
        <Route path="/historia-jvm" component={HistoriaJvm} />
        <Route path="/instalar-kotlin" component={InstalarKotlin} />
        <Route path="/kotlin-cli" component={KotlinCli} />
        <Route path="/repl" component={Repl} />
        <Route path="/primeiro-projeto" component={PrimeiroProjeto} />
        <Route path="/gradle-basico" component={GradleBasico} />
        <Route path="/intellij-config" component={IntellijConfig} />
        <Route path="/variaveis-val-var" component={VariaveisValVar} />
        <Route path="/tipos-basicos" component={TiposBasicos} />
        <Route path="/operadores" component={Operadores} />
        <Route path="/strings-templates" component={StringsTemplates} />
        <Route path="/controle-fluxo" component={ControleFluxo} />
        <Route path="/when-expression" component={WhenExpression} />
        <Route path="/ranges" component={Ranges} />
        <Route path="/loops" component={Loops} />
        <Route path="/funcoes" component={Funcoes} />
        <Route path="/funcoes-default-named" component={FuncoesDefaultNamed} />
        <Route path="/lambdas" component={Lambdas} />
        <Route path="/higher-order" component={HigherOrder} />
        <Route path="/null-safety" component={NullSafety} />
        <Route path="/operador-elvis" component={OperadorElvis} />
        <Route path="/safe-call" component={SafeCall} />
        <Route path="/not-null-assertion" component={NotNullAssertion} />
        <Route path="/let-also-run-apply" component={LetAlsoRunApply} />
        <Route path="/classes" component={Classes} />
        <Route path="/construtores" component={Construtores} />
        <Route path="/propriedades" component={Propriedades} />
        <Route path="/heranca" component={Heranca} />
        <Route path="/interfaces" component={Interfaces} />
        <Route path="/classes-abstratas" component={ClassesAbstratas} />
        <Route path="/data-class" component={DataClass} />
        <Route path="/sealed-class" component={SealedClass} />
        <Route path="/enum-class" component={EnumClass} />
        <Route path="/object-singleton" component={ObjectSingleton} />
        <Route path="/companion-object" component={CompanionObject} />
        <Route path="/inner-nested" component={InnerNested} />
        <Route path="/extension-functions" component={ExtensionFunctions} />
        <Route path="/infix-functions" component={InfixFunctions} />
        <Route path="/operator-overload" component={OperatorOverload} />
        <Route path="/inline-functions" component={InlineFunctions} />
        <Route path="/tailrec" component={Tailrec} />
        <Route path="/funcoes-locais" component={FuncoesLocais} />
        <Route path="/type-alias" component={TypeAlias} />
        <Route path="/value-class" component={ValueClass} />
        <Route path="/listas" component={Listas} />
        <Route path="/sets" component={Sets} />
        <Route path="/mapas" component={Mapas} />
        <Route path="/mutable-immutable" component={MutableImmutable} />
        <Route path="/operacoes-funcionais" component={OperacoesFuncionais} />
        <Route path="/sequences" component={Sequences} />
        <Route path="/group-by" component={GroupBy} />
        <Route path="/map-filter-reduce" component={MapFilterReduce} />
        <Route path="/flat-map" component={FlatMap} />
        <Route path="/arrays" component={Arrays} />
        <Route path="/intro-coroutines" component={IntroCoroutines} />
        <Route path="/coroutine-builders" component={CoroutineBuilders} />
        <Route path="/coroutine-context" component={CoroutineContext} />
        <Route path="/dispatchers" component={Dispatchers} />
        <Route path="/async-await" component={AsyncAwait} />
        <Route path="/flows" component={Flows} />
        <Route path="/state-flow" component={StateFlow} />
        <Route path="/shared-flow" component={SharedFlow} />
        <Route path="/channels" component={Channels} />
        <Route path="/exception-handling-coroutines" component={ExceptionHandlingCoroutines} />
        <Route path="/generics" component={Generics} />
        <Route path="/variance" component={Variance} />
        <Route path="/star-projection" component={StarProjection} />
        <Route path="/reified-types" component={ReifiedTypes} />
        <Route path="/reflexao" component={Reflexao} />
        <Route path="/annotations" component={Annotations} />
        <Route path="/type-safe-builders" component={TypeSafeBuilders} />
        <Route path="/context-receivers" component={ContextReceivers} />
        <Route path="/delegates" component={Delegates} />
        <Route path="/excecoes" component={Excecoes} />
        <Route path="/try-catch" component={TryCatch} />
        <Route path="/result-class" component={ResultClass} />
        <Route path="/runcatching" component={RunCatching} />
        <Route path="/junit5" component={Junit5} />
        <Route path="/kotest" component={Kotest} />
        <Route path="/mockk" component={Mockk} />
        <Route path="/coroutine-testing" component={CoroutineTesting} />
        <Route path="/property-based" component={PropertyBased} />
        <Route path="/coverage" component={Coverage} />
        <Route path="/gradle-kts" component={GradleKts} />
        <Route path="/maven" component={Maven} />
        <Route path="/ktlint" component={Ktlint} />
        <Route path="/detekt" component={Detekt} />
        <Route path="/dokka" component={Dokka} />
        <Route path="/multiplataforma" component={Multiplataforma} />
        <Route path="/kotlin-script" component={KotlinScript} />
        <Route path="/publicar-lib" component={PublicarLib} />
        <Route path="/spring-setup" component={SpringSetup} />
        <Route path="/spring-controllers" component={SpringControllers} />
        <Route path="/spring-services" component={SpringServices} />
        <Route path="/spring-data-jpa" component={SpringDataJpa} />
        <Route path="/spring-validation" component={SpringValidation} />
        <Route path="/spring-security" component={SpringSecurity} />
        <Route path="/spring-jwt" component={SpringJwt} />
        <Route path="/spring-testing" component={SpringTesting} />
        <Route path="/spring-webflux" component={SpringWebflux} />
        <Route path="/spring-actuator" component={SpringActuator} />
        <Route path="/ktor-setup" component={KtorSetup} />
        <Route path="/ktor-routing" component={KtorRouting} />
        <Route path="/ktor-content-negotiation" component={KtorContentNegotiation} />
        <Route path="/ktor-auth" component={KtorAuth} />
        <Route path="/ktor-database" component={KtorDatabase} />
        <Route path="/ktor-websockets" component={KtorWebsockets} />
        <Route path="/ktor-client" component={KtorClient} />
        <Route path="/ktor-testing" component={KtorTesting} />
        <Route path="/exposed-orm" component={ExposedOrm} />
        <Route path="/jdbi" component={Jdbi} />
        <Route path="/r2dbc" component={R2dbc} />
        <Route path="/flyway" component={Flyway} />
        <Route path="/postgres-conexao" component={PostgresConexao} />
        <Route path="/mongodb-driver" component={MongodbDriver} />
        <Route path="/android-intro" component={AndroidIntro} />
        <Route path="/activities-fragments" component={ActivitiesFragments} />
        <Route path="/jetpack-compose" component={JetpackCompose} />
        <Route path="/compose-state" component={ComposeState} />
        <Route path="/compose-navigation" component={ComposeNavigation} />
        <Route path="/viewmodel" component={Viewmodel} />
        <Route path="/room-db" component={RoomDb} />
        <Route path="/retrofit" component={Retrofit} />
        <Route path="/hilt-di" component={HiltDi} />
        <Route path="/android-coroutines" component={AndroidCoroutines} />
        <Route path="/kmp-intro" component={KmpIntro} />
        <Route path="/kmp-shared" component={KmpShared} />
        <Route path="/compose-multiplatform" component={ComposeMultiplatform} />
        <Route path="/interop-java" component={InteropJava} />
        <Route path="/interop-js" component={InteropJs} />
        <Route path="/native" component={Native} />
        <Route path="/serialization" component={Serialization} />
        <Route path="/ktorm" component={Ktorm} />
        <Route path="/projeto-cli" component={ProjetoCli} />
        <Route path="/projeto-rest-api" component={ProjetoRestApi} />
        <Route path="/projeto-graphql" component={ProjetoGraphql} />
        <Route path="/projeto-android-todo" component={ProjetoAndroidTodo} />
        <Route path="/projeto-spring-fullstack" component={ProjetoSpringFullstack} />
        <Route path="/projeto-microservico" component={ProjetoMicroservico} />
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </main>
          </div>
        </div>
      </WouterRouter>
    );
  }
  