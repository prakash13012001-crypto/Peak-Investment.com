import React,{useState,useMemo,Component} from "react";
import {
  LayoutDashboard,Wallet,UserCircle,BarChart3,
  TrendingUp,TrendingDown,Plus,Trash2,
  ArrowLeft,Send,Bell,ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer,PieChart,Pie,Cell,
  LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid
} from "recharts";

/* ===============================
   ERROR BOUNDARY
================================= */

class ErrorBoundary extends Component{
  constructor(props){
    super(props);
    this.state={hasError:false};
  }
  static getDerivedStateFromError(){
    return{hasError:true};
  }
  componentDidCatch(error,info){
    console.error("App error:",error,info);
  }
  render(){
    if(this.state.hasError){
      return(
        <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6">
          <h1 className="text-2xl font-black text-red-400 mb-4">Something went wrong</h1>
          <p className="text-slate-400 text-sm text-center max-w-sm">
            An unexpected error occurred. Please refresh the page.
          </p>
          <button
            onClick={()=>window.location.reload()}
            className="mt-6 px-6 py-3 bg-emerald-500 text-black font-bold rounded-2xl"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ===============================
   PORTFOLIOPRO AI PREMIUM APP
   React + Tailwind Production
================================= */

const COLORS=["#10b981","#f59e0b","#3b82f6","#ef4444"];

const QUESTIONS=[
  {
    id:1,
    q:"What is your age?",
    o:["Under 25","25-40","41-55","55+"],
    s:[5,4,3,2]
  },
  {
    id:2,
    q:"Monthly income stability?",
    o:["Very Stable","Stable","Average","Uncertain"],
    s:[5,4,3,2]
  },
  {
    id:3,
    q:"If market falls 20%?",
    o:["Sell","Sell Some","Hold","Buy More"],
    s:[1,2,4,5]
  },
  {
    id:4,
    q:"Investment knowledge?",
    o:["Expert","Good","Basic","Beginner"],
    s:[5,4,3,2]
  },
  {
    id:5,
    q:"Goal horizon?",
    o:["10+ Years","5 Years","3 Years","1 Year"],
    s:[5,4,3,2]
  }
];

const sampleHoldings={
  Equity:[
    {name:"Reliance",qty:10,value:30000},
    {name:"HDFC Bank",qty:8,value:18000}
  ],
  Gold:[
    {name:"SGB",qty:5,value:32000}
  ],
  Debt:[
    {name:"Liquid Fund",qty:1,value:20000}
  ]
};

const trendData=[
  {name:"Jan",v:10},
  {name:"Feb",v:14},
  {name:"Mar",v:13},
  {name:"Apr",v:18},
  {name:"May",v:22},
  {name:"Jun",v:26}
];

/* ===============================
   REUSABLE COMPONENTS
================================= */

const Card=({children,className=""})=>(
  <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl ${className}`}>
    {children}
  </div>
);

const Button=({children,onClick,className=""})=>(
  <button
    onClick={onClick}
    className={`px-4 py-3 rounded-2xl font-bold active:scale-95 transition ${className}`}
  >
    {children}
  </button>
);

const Title=({children})=>(
  <h2 className="text-xl font-black tracking-tight">{children}</h2>
);

/* ===============================
   LANDING
================================= */

function Landing({setPage}){
  return(
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center mb-8 shadow-2xl">
        <TrendingUp size={42}/>
      </div>

      <h1 className="text-5xl font-black tracking-tight">
        Portfolio<span className="text-emerald-400">Pro</span>
      </h1>

      <p className="text-slate-400 mt-3 text-center max-w-xs">
        AI Powered Wealth Management Platform
      </p>

      <Button
        onClick={()=>setPage("quiz")}
        className="mt-10 bg-emerald-500 text-black w-full max-w-sm"
      >
        Start Now
      </Button>
    </div>
  );
}

/* ===============================
   QUIZ
================================= */

function Quiz({setPage,setRisk,setProfile}){
  const [step,setStep]=useState(0);
  const [ans,setAns]=useState([]);

  const q=QUESTIONS[step];

  function submit(idx){
    const next=[...ans,idx];
    setAns(next);

    if(step<QUESTIONS.length-1){
      setStep(step+1);
    }else{
      let total=0;
      QUESTIONS.forEach((x,i)=>total+=x.s[next[i]]);
      const score=Math.round(total/(QUESTIONS.length*5)*100);

      let cat="Moderate";
      if(score<=35)cat="Conservative";
      if(score>=71)cat="Aggressive";

      setRisk(score);
      setProfile(cat);
      setPage("dashboard");
    }
  }

  return(
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500"
            style={{width:`${((step+1)/QUESTIONS.length)*100}%`}}
          ></div>
        </div>
      </div>

      <h2 className="text-3xl font-black leading-tight mb-10">{q.q}</h2>

      <div className="space-y-4">
        {q.o.map((x,i)=>(
          <button
            key={i}
            onClick={()=>submit(i)}
            className="w-full bg-slate-900 border border-slate-800 p-5 rounded-3xl text-left hover:border-emerald-500 transition"
          >
            {x}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===============================
   DASHBOARD
================================= */

function Dashboard({risk,profile,holdings,setPage}){

  const total=useMemo(()=>{
    return Object.values(holdings)
      .flat()
      .reduce((a,b)=>a+Number(b.value),0);
  },[holdings]);

  const pie=useMemo(()=>{
    const eq=holdings.Equity.reduce((a,b)=>a+b.value,0);
    const g=holdings.Gold.reduce((a,b)=>a+b.value,0);
    const d=holdings.Debt.reduce((a,b)=>a+b.value,0);

    return[
      {name:"Equity",value:Math.round(eq/total*100)||0},
      {name:"Gold",value:Math.round(g/total*100)||0},
      {name:"Debt",value:Math.round(d/total*100)||0}
    ];
  },[holdings,total]);

  return(
    <div className="min-h-screen bg-slate-950 text-white p-5 pb-28">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3 items-center">
          <div className="w-11 h-11 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <UserCircle className="text-emerald-400"/>
          </div>
          <div>
            <p className="text-xs text-slate-400">Welcome</p>
            <h3 className="font-bold">Guest Investor</h3>
          </div>
        </div>

        <div className="p-3 bg-slate-900 rounded-2xl">
          <Bell size={18}/>
        </div>
      </div>

      {/* SCORE */}
      <Card className="text-center mb-5">
        <div className="text-5xl font-black text-emerald-400">{risk}%</div>
        <p className="text-slate-400 mt-2">{profile} Risk Profile</p>
      </Card>

      {/* NETWORTH */}
      <Card className="mb-5">
        <p className="text-slate-400 text-sm">Portfolio Value</p>
        <h2 className="text-3xl font-black mt-2">₹{total.toLocaleString()}</h2>

        <div className="mt-4 flex gap-3 text-sm">
          <div className="text-emerald-400 flex items-center gap-1">
            <TrendingUp size={14}/> +12.4%
          </div>
          <div className="text-slate-500">This Year</div>
        </div>
      </Card>

      {/* CHART */}
      <Card className="mb-5">
        <Title>Growth Trend</Title>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid stroke="#1e293b"/>
              <XAxis dataKey="name" stroke="#64748b"/>
              <YAxis stroke="#64748b"/>
              <Tooltip/>
              <Line
                type="monotone"
                dataKey="v"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ALLOCATION */}
      <Card className="mb-5">
        <Title>Asset Allocation</Title>

        <div className="h-60 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pie}
                dataKey="value"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
              >
                {pie.map((e,i)=>
                  <Cell key={i} fill={COLORS[i]}/>
                )}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 mt-2">
          {pie.map((x,i)=>(
            <div key={i} className="flex justify-between text-sm">
              <span>{x.name}</span>
              <span style={{color:COLORS[i]}}>{x.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* INSIGHT */}
      <Card className="mb-5">
        <div className="flex justify-between items-center">
          <Title>AI Suggestion</Title>
          <ShieldCheck className="text-emerald-400"/>
        </div>

        <p className="text-slate-300 mt-4 leading-relaxed text-sm">
          Your current allocation is aligned with a{" "}
          <span className="text-emerald-400 font-bold">{profile}</span>{" "}
          investor. Continue SIP discipline and rebalance quarterly.
        </p>
      </Card>

    </div>
  );
}

/* ===============================
   PORTFOLIO PAGE
================================= */

function Portfolio({holdings,setHoldings,setPage}){

  const [asset,setAsset]=useState("Equity");
  const [name,setName]=useState("");
  const [qty,setQty]=useState("");
  const [value,setValue]=useState("");

  function add(){
    if(!name||!qty||!value)return;

    setHoldings(prev=>({
      ...prev,
      [asset]:[
        ...prev[asset],
        {
          name,
          qty:Number(qty),
          value:Number(value)
        }
      ]
    }));

    setName("");setQty("");setValue("");
  }

  function remove(i){
    setHoldings(prev=>({
      ...prev,
      [asset]:prev[asset].filter((_,x)=>x!==i)
    }));
  }

  return(
    <div className="min-h-screen bg-slate-950 text-white p-5 pb-28">

      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>setPage("dashboard")}>
          <ArrowLeft/>
        </button>
        <h2 className="text-2xl font-black">Portfolio</h2>
      </div>

      <div className="flex gap-2 mb-5">
        {["Equity","Gold","Debt"].map(x=>(
          <Button
            key={x}
            onClick={()=>setAsset(x)}
            className={asset===x
              ?"bg-emerald-500 text-black"
              :"bg-slate-900 text-white"}
          >
            {x}
          </Button>
        ))}
      </div>

      <Card className="mb-5">
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Asset Name"
          className="w-full bg-slate-800 p-3 rounded-2xl mb-3"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            value={qty}
            onChange={e=>setQty(e.target.value)}
            placeholder="Qty"
            className="bg-slate-800 p-3 rounded-2xl"
          />

          <input
            value={value}
            onChange={e=>setValue(e.target.value)}
            placeholder="Value"
            className="bg-slate-800 p-3 rounded-2xl"
          />
        </div>

        <Button
          onClick={add}
          className="w-full mt-4 bg-emerald-500 text-black"
        >
          <Plus className="inline mr-2"/> Add Holding
        </Button>
      </Card>

      <div className="space-y-3">
        {holdings[asset].map((x,i)=>(
          <Card key={i}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{x.name}</h3>
                <p className="text-sm text-slate-400">
                  Qty {x.qty} • ₹{x.value.toLocaleString()}
                </p>
              </div>

              <button onClick={()=>remove(i)}>
                <Trash2 className="text-red-400"/>
              </button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}

/* ===============================
   AI COACH
================================= */

function Coach({setPage}){
  const [msg,setMsg]=useState("");
  const [chat,setChat]=useState([
    {
      u:false,
      t:"Hello! I'm your AI wealth coach. Ask anything."
    }
  ]);

  function send(){
    if(!msg)return;

    const m=msg;
    setChat(p=>[...p,{u:true,t:m}]);
    setMsg("");

    setTimeout(()=>{
      setChat(p=>[
        ...p,
        {
          u:false,
          t:"Based on your profile, stay diversified, continue SIP and avoid emotional investing."
        }
      ]);
    },700);
  }

  return(
    <div className="min-h-screen bg-slate-950 text-white p-5 pb-28 flex flex-col">

      <div className="flex items-center gap-3 mb-5">
        <button onClick={()=>setPage("dashboard")}>
          <ArrowLeft/>
        </button>
        <h2 className="text-2xl font-black">AI Coach</h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {chat.map((x,i)=>(
          <div
            key={i}
            className={`max-w-[85%] p-4 rounded-3xl ${
              x.u
                ?"bg-emerald-500 text-black ml-auto"
                :"bg-slate-900"
            }`}
          >
            {x.t}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={msg}
          onChange={e=>setMsg(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 bg-slate-900 p-4 rounded-2xl"
        />

        <Button
          onClick={send}
          className="bg-emerald-500 text-black"
        >
          <Send size={18}/>
        </Button>
      </div>

    </div>
  );
}

/* ===============================
   MAIN APP
================================= */

export default function App(){

  const [page,setPage]=useState("landing");
  const [risk,setRisk]=useState(65);
  const [profile,setProfile]=useState("Moderate");
  const [holdings,setHoldings]=useState(sampleHoldings);

  function render(){
    if(page==="landing")
      return <Landing setPage={setPage}/>;

    if(page==="quiz")
      return(
        <Quiz
          setPage={setPage}
          setRisk={setRisk}
          setProfile={setProfile}
        />
      );

    if(page==="portfolio")
      return(
        <Portfolio
          holdings={holdings}
          setHoldings={setHoldings}
          setPage={setPage}
        />
      );

    if(page==="coach")
      return <Coach setPage={setPage}/>;

    return(
      <Dashboard
        risk={risk}
        profile={profile}
        holdings={holdings}
        setPage={setPage}
      />
    );
  }

  return(
    <ErrorBoundary>
      <div className="bg-slate-950 min-h-screen">
        {render()}

        {page!=="landing"&&page!=="quiz"&&(
          <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-3 flex justify-between text-slate-400">

            <button
              onClick={()=>setPage("dashboard")}
              className="flex flex-col items-center"
            >
              <LayoutDashboard size={20}/>
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={()=>setPage("portfolio")}
              className="flex flex-col items-center"
            >
              <Wallet size={20}/>
              <span className="text-xs">Assets</span>
            </button>

            <button
              onClick={()=>setPage("coach")}
              className="flex flex-col items-center"
            >
              <BarChart3 size={20}/>
              <span className="text-xs">Coach</span>
            </button>

            <button
              onClick={()=>setPage("dashboard")}
              className="flex flex-col items-center"
            >
              <UserCircle size={20}/>
              <span className="text-xs">Profile</span>
            </button>

          </nav>
        )}
      </div>
    </ErrorBoundary>
  );
}
