(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const SAVE_KEY = "tva-ashenford-save-v1";
  const clamp = (n) => Math.max(0, Math.min(100, n));
  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const roles = {
    traveller:{name:"Wayfarer",intro:"You have come to Ashenford with little more than a weatherworn cloak and a stranger's name."},
    apprentice:{name:"Healer's apprentice",intro:"Your training has brought you to Ashenford. The scent of rosemary follows your satchel."},
    merchant:{name:"Merchant's kin",intro:"A family token and a keen eye for bargains mark you as kin to a trading household."},
    courier:{name:"Royal courier",intro:"A sealed letter rests inside your coat. Its destination is the keep above the village."}
  };
  const places = {
    market:{name:"The Market Cross",short:"Market",icon:"⚖",eyebrow:"THE SETTLEMENT OF ASHENFORD",desc:"A damp morning settles over the village. Traders raise their awnings beneath the watchful shadow of the abbey bell.",weather:"MIST ON THE COBBLES",scene:"market"},
    infirmary:{name:"St. Brigid's Infirmary",short:"Infirmary",icon:"⚕",eyebrow:"THE HOUSE OF HEALING",desc:"Bundles of dried herbs hang from the rafters. A narrow bed stands beside a window filmed with rain.",weather:"HERBS AND WOODSMOKE",scene:"infirmary"},
    tavern:{name:"The Fox & Lantern",short:"Tavern",icon:"♨",eyebrow:"THE VILLAGE TAVERN",desc:"A low fire burns beneath blackened rafters. A few patrons speak in whispers over their cups.",weather:"WARM LIGHT, LOW VOICES",scene:"tavern"},
    abbey:{name:"The Abbey of St. Cuthbert",short:"Abbey",icon:"✟",eyebrow:"THE ABBEY PRECINCT",desc:"The old stone abbey rises above the rooftops. Its bell tower is quiet, though the villagers say otherwise.",weather:"COLD STONE AND INCENSE",scene:"abbey"},
    gate:{name:"The North Gate",short:"North Gate",icon:"⚑",eyebrow:"THE NORTHERN ROAD",desc:"The gate stands open to a muddy road, rutted by carts and hoofprints. A line of bare trees fades into the mist.",weather:"WIND FROM THE FIELDS",scene:"gate"},
    keep:{name:"Ashenford Keep",short:"Keep",icon:"♜",eyebrow:"THE LORD'S KEEP",desc:"A small fortress overlooks the settlement. Servants hurry through the courtyard beneath the lord's banner.",weather:"FLAGS IN THE WIND",scene:"keep"}
  };
  const people = {
    edmund:{id:"edmund",name:"Edmund Blackthorn",role:"Plague physician",icon:"⚕",age:46,location:"infirmary",lore:"A severe physician with a guarded heart. He trusts evidence, routine, and very few people.",connections:"Margaret supplies his herbs. Brother Anselm sometimes brings him food for the sick.",greeting:"Hold there. The infirmary is no place for idle curiosity. Tell me, traveller, what dost thou seek?",emotions:{fear:12,concern:48,anger:18,trust:16,curiosity:54},voice:"formal"},
    margaret:{id:"margaret",name:"Margaret Whitmore",role:"Merchant",icon:"⚖",age:39,location:"market",lore:"A quick-witted trader who remembers every debt, promise, and face that passes her stall.",connections:"Rowan keeps her parcels at the tavern. Edmund is one of her oldest customers.",greeting:"Ah, a new face. If thou hast coin, I have wares; if thou hast gossip, I may have time.",emotions:{fear:8,concern:26,anger:12,trust:30,curiosity:68},voice:"sharp"},
    rowan:{id:"rowan",name:"Rowan Pike",role:"Innkeeper",icon:"♨",age:52,location:"tavern",lore:"A patient listener who has heard more secrets than he admits. He remembers what is said after the second cup.",connections:"Margaret trusts him with parcels. Mara's brother once worked in his stables.",greeting:"Come in from the wet, friend. There is broth by the hearth and a tale in every corner.",emotions:{fear:10,concern:35,anger:8,trust:36,curiosity:45},voice:"warm"},
    anselm:{id:"anselm",name:"Brother Anselm",role:"Abbey novice",icon:"✟",age:24,location:"abbey",lore:"A quiet novice whose hands are more accustomed to carrying supplies than copying scripture.",connections:"He brings provisions to Edmund's patients. Rowan has seen him near the north road.",greeting:"Peace be with thee. The abbey welcomes a respectful guest, though these are troubled days.",emotions:{fear:42,concern:58,anger:4,trust:20,curiosity:34},voice:"gentle"},
    mara:{id:"mara",name:"Mara Fenwick",role:"Washerwoman",icon:"✺",age:31,location:"gate",lore:"Practical, observant, and fiercely loyal to her missing cousin Will.",connections:"Rowan employed Will in the stables. Serjeant Hobb questioned him last week.",greeting:"If thou hast seen a young man upon the northern road, speak plainly. I have little patience for riddles.",emotions:{fear:30,concern:78,anger:25,trust:24,curiosity:40},voice:"direct"},
    hobb:{id:"hobb",name:"Serjeant Hobb",role:"Gate serjeant",icon:"⚔",age:44,location:"gate",lore:"A disciplined guard who follows orders, watches strangers, and dislikes disturbances at the gate.",connections:"He reports to Steward Alwyn and has a long-standing quarrel with Rowan.",greeting:"Halt. State thy business within Ashenford. I keep the road, and I keep account of those who pass.",emotions:{fear:8,concern:22,anger:26,trust:15,curiosity:19},voice:"stern"},
    alwyn:{id:"alwyn",name:"Steward Alwyn",role:"Keeper of accounts",icon:"▤",age:57,location:"keep",lore:"The steward controls the keep's stores and knows the value of every sack of grain.",connections:"He serves King Aldric and quietly relies on Margaret's market reports.",greeting:"The keep receives petitioners by appointment. What matter brings thee before the steward?",emotions:{fear:4,concern:19,anger:22,trust:12,curiosity:35},voice:"measured"},
    aldric:{id:"aldric",name:"King Aldric III",role:"Lord of Ashenford",icon:"♜",age:49,location:"keep",lore:"A proud ruler facing pressure from the road, the abbey, and the village households.",connections:"Steward Alwyn manages his stores. He has heard reports of the strange bell.",greeting:"Thou standest before Aldric of Ashenford. Speak with care; my time is not without price.",emotions:{fear:2,concern:42,anger:17,trust:8,curiosity:28},voice:"royal"}
  };
  function defaultState(){
    const npc={}; for(const p of Object.values(people)) npc[p.id]={met:false,emotions:{...p.emotions},memories:[],opinion:"Unknown"};
    return {version:1,started:false,role:"traveller",roleName:"Wayfarer",location:"market",day:1,minute:555,chapter:"The Stranger",reputation:"Unknown",inventory:[{id:"travel-cloak",name:"Weatherworn cloak",icon:"🧥",desc:"A sturdy cloak, damp from the road."}],quests:{bell:0,ledger:-1,parcel:-1,will:-1},flags:{sawFibres:false,herbs:false,linen:false,willFound:false,keepUnlocked:false,ending:""},npc,events:["The market is waking beneath a veil of mist.","A bell was heard after midnight, though the abbey says its clapper is removed."],timeline:[],dialogueLog:{},lastSaved:0};
  }
  let state=defaultState(), selectedRole="traveller", activePerson=null, activeTab="world";
  let toastTimer=null, activeRequestController=null, pendingDialogueLine=null;
  function timeLabel(){const h=Math.floor(state.minute/60)%24,m=state.minute%60;return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");}
  function dateLabel(){return "Day "+state.day+" · "+timeLabel();}
  function roman(n){return ["I","II","III","IV","V","VI","VII","VIII","IX","X"][n-1]||String(n);}
  function toast(msg){const el=$("#toast");if(!el)return;el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
  function save(show=false){
    try{state.lastSaved=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));$("#save-indicator").innerHTML='<span class="save-dot"></span><span>Chronicle saved</span>';$("#footer-save").textContent="YOUR STORY IS KEPT ON THIS DEVICE";if(show)toast("Your chronicle has been saved.");}
    catch(e){$("#save-indicator").textContent="Save unavailable";toast("Browser storage is unavailable. Export a save as backup.");}
  }
  function load(){
    try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;const saved=JSON.parse(raw);if(!saved||saved.version!==1)return false;state={...defaultState(),...saved,npc:{...defaultState().npc,...saved.npc}};Object.keys(state.npc).forEach(id=>{state.npc[id]={...defaultState().npc[id],...state.npc[id],emotions:{...defaultState().npc[id].emotions,...(state.npc[id].emotions||{})}};});return !!state.started;}catch(e){return false;}
  }
  function addTimeline(text){state.timeline.unshift({day:state.day,time:timeLabel(),text});state.timeline=state.timeline.slice(0,12);save();}
  function addEvent(text){state.events.unshift(text);state.events=state.events.slice(0,5);save();}
  function changeTime(minutes){
    state.minute+=minutes;while(state.minute>=1440){state.minute-=1440;state.day++;addEvent("Dawn has broken upon another day in Ashenford.");addTimeline("A new day begins in the village.");}
  }
  function ps(id){return state.npc[id];}
  function remember(id,text){const p=ps(id);p.memories.unshift(text);p.memories=p.memories.slice(0,5);}
  function adjust(id,delta){
    const e=ps(id).emotions;Object.entries(delta).forEach(([k,v])=>{if(k in e)e[k]=clamp(e[k]+v);});
    const trust=e.trust, fear=e.fear, anger=e.anger;
    ps(id).opinion=trust>72?"Trusted friend":fear>68?"Frightened of you":anger>65?"Deeply offended":trust>48?"Friendly":fear>45?"Wary":anger>35?"Irritated": "Cautious stranger";
  }
  function activeAt(id){
    const p=people[id],h=Math.floor(state.minute/60);
    if(id==="edmund")return state.location==="infirmary"||(state.location==="market"&&h>=11&&h<13);
    if(id==="margaret")return state.location==="market"&&h>=6&&h<18;
    if(id==="rowan")return state.location==="tavern"||(state.location==="market"&&h>=7&&h<9);
    if(id==="anselm")return state.location==="abbey"||(state.location==="infirmary"&&h>=15&&h<17);
    if(id==="mara")return state.location==="gate"||(state.location==="market"&&h>=8&&h<10);
    if(id==="hobb")return state.location==="gate"||(state.location==="keep"&&h>=8&&h<17);
    if(id==="alwyn")return state.location==="keep";
    if(id==="aldric")return state.location==="keep"&&h>=9&&h<18;
    return state.location===p.location;
  }
  function presentPeople(){return Object.values(people).filter(p=>activeAt(p.id));}
  function buildSceneSvg(scene){
    const palettes={market:["#6b705b","#b29b70"],infirmary:["#75806a","#ab946b"],tavern:["#5a4834","#a77d49"],abbey:["#72776c","#b3a58a"],gate:["#6c7864","#a88d5f"],keep:["#616a66","#b49b6e"]};
    const [ground,roof]=palettes[scene]||palettes.market;
    const label={market:"MARKET CROSS",infirmary:"ST BRIGID'S INFIRMARY",tavern:"THE FOX & LANTERN",abbey:"THE ABBEY",gate:"THE NORTH GATE",keep:"ASHENFORD KEEP"}[scene];
    return `<svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#9b9c8d"/><stop offset=".58" stop-color="#c0b49a"/><stop offset="1" stop-color="#706a55"/></linearGradient><linearGradient id="stone" x2="0" y2="1"><stop stop-color="#b7aa8d"/><stop offset="1" stop-color="#655a46"/></linearGradient><linearGradient id="road" x2="0" y2="1"><stop stop-color="#847a63"/><stop offset="1" stop-color="#443c2e"/></linearGradient></defs>
      <rect width="1200" height="500" fill="url(#sky)"/><path d="M0 205 Q180 115 340 205T690 192T1200 180V330H0Z" fill="#747b69"/><path d="M0 250L120 165 238 250V405H0Z" fill="#514838"/><path d="M-15 240L120 120 255 240Z" fill="${roof}" stroke="#3d3428" stroke-width="10"/><path d="M960 250L1065 150 1190 250V410H960Z" fill="#514637"/><path d="M940 248L1068 118 1210 248Z" fill="${roof}" stroke="#3d3428" stroke-width="10"/><g fill="#d1c5a7" stroke="#574c3b" stroke-width="8"><rect x="65" y="260" width="115" height="142"/><rect x="1014" y="267" width="125" height="138"/></g><g fill="#4a3e2e"><rect x="95" y="290" width="25" height="42"/><rect x="143" y="290" width="25" height="42"/><rect x="1040" y="295" width="28" height="45"/><rect x="1086" y="295" width="28" height="45"/></g>
      <g opacity=".9"><path d="M470 240V102L535 43 600 102V240Z" fill="#807b6a" stroke="#403b31" stroke-width="9"/><path d="M510 45V12H560V45" fill="#756e5c" stroke="#403b31" stroke-width="7"/><path d="M535 11V-5M523 18H547" stroke="#3f392e" stroke-width="5"/><path d="M493 140Q535 90 577 140V240H493Z" fill="#403a30"/><path d="M520 182Q535 150 550 182V240H520Z" fill="#c0a878"/></g>
      <path d="M0 360Q260 330 420 366T810 355T1200 348V500H0Z" fill="url(#road)"/><path d="M0 390Q250 350 510 398T1200 375" stroke="#b0a083" stroke-width="4" opacity=".35" fill="none"/>
      <g fill="#3f3629" stroke="#2a241c" stroke-width="6"><path d="M270 350V255L345 205 420 255V365Z"/><path d="M790 354V250L858 205 930 250V365Z"/><path d="M290 254L345 195 401 254Z" fill="${roof}"/><path d="M806 250L860 194 915 250Z" fill="${roof}"/></g>
      <g fill="#c5ae82" stroke="#4b402e" stroke-width="5"><rect x="310" y="283" width="24" height="42"/><rect x="352" y="283" width="24" height="42"/><rect x="831" y="278" width="24" height="42"/><rect x="873" y="278" width="24" height="42"/></g>
      <g stroke="#463b2b" stroke-width="7"><path d="M395 330V258L470 230 545 258V330Z" fill="#8e704c"/><path d="M382 258L470 208 558 258Z" fill="${roof}"/><path d="M654 330V258L720 230 786 258V330Z" fill="#8e704c"/><path d="M641 258L720 210 799 258Z" fill="${roof}"/></g>
      <g fill="#4e3e2b"><path d="M0 450Q140 410 270 448T520 440T800 455T1200 430V500H0Z"/></g>
      <g opacity=".55" fill="#d8d0bb"><circle cx="170" cy="82" r="24"/><circle cx="205" cy="76" r="18"/><circle cx="900" cy="98" r="32"/><circle cx="940" cy="90" r="22"/></g>
      <g fill="#c8b28a" stroke="#4e402d" stroke-width="4"><path d="M575 362V290H590V362M620 362V290H635V362" /><path d="M560 300H650L642 284H568Z"/></g>
      <g fill="#383127"><circle cx="680" cy="359" r="10"/><path d="M671 370L689 370 696 430H665Z"/><circle cx="730" cy="373" r="8"/><path d="M723 382H738L744 429H718Z"/><circle cx="240" cy="378" r="8"/><path d="M232 388H248L255 438H225Z"/></g>
      <g fill="#a99065" opacity=".18"><path d="M0 150H1200V250H0Z"/></g><text x="600" y="474" text-anchor="middle" fill="#e8d7b5" opacity=".4" font-family="Georgia" font-size="14" letter-spacing="5">${label}</text>
    </svg>`;
  }
  function renderScene(){
    const p=places[state.location];$("#scene-title").textContent=p.name;$("#scene-description").textContent=p.desc;$("#scene-eyebrow").textContent=p.eyebrow;$("#scene-caption").textContent=p.name.toUpperCase()+" · ASHENFORD";$("#scene-weather").textContent=p.weather;$("#scene-art").innerHTML=buildSceneSvg(p.scene);
    const spots=[];
    if(state.location==="market"&&state.quests.ledger===0){if(!state.flags.herbs)spots.push({label:"Gather rosemary",x:31,y:65,action:"herbs"});if(!state.flags.linen)spots.push({label:"Collect clean linen",x:68,y:67,action:"linen"});}
    if(state.location==="abbey"&&state.quests.bell===3&&!state.flags.sawFibres)spots.push({label:"Examine the bell tower",x:53,y:35,action:"tower"});
    if(state.location==="gate"&&state.quests.will===0&&!state.flags.willFound)spots.push({label:"Search the roadside",x:52,y:68,action:"will"});
    $("#scene-hotspots").innerHTML=spots.map(s=>`<button class="scene-hotspot" style="left:${s.x}%;top:${s.y}%" data-action="${s.action}">${s.label}</button>`).join("");
  }
  function renderPlaces(){
    $("#place-grid").innerHTML=Object.entries(places).map(([id,p])=>`<button class="place-card ${state.location===id?"current":""}" data-place="${id}" ${id==="keep"&&!state.flags.keepUnlocked?'title="The keep is closed to strangers"':''}><span class="place-symbol">${p.icon}</span><span class="place-copy"><strong>${p.short}</strong><small>${id==="keep"&&!state.flags.keepUnlocked?"Access restricted":p.desc.slice(0,46)+"…"}</small></span></button>`).join("");
    $$("#place-grid [data-place]").forEach(b=>b.addEventListener("click",()=>travel(b.dataset.place)));
  }
  function renderPeople(){
    const present=presentPeople();$("#present-count").textContent=present.length;
    $("#inhabitants-list").innerHTML=present.map(p=>`<button class="inhabitant-card" data-person="${p.id}"><span class="mini-portrait">${p.icon}</span><span class="inhabitant-copy"><strong>${p.name}</strong><small>${p.role}</small></span><span class="presence-dot"></span></button>`).join("")||'<p class="speech-hint">No one is nearby.</p>';
    $$("[data-person]").forEach(b=>b.addEventListener("click",()=>openDialogue(b.dataset.person)));
    $("#people-count").textContent=Object.values(people).filter(p=>ps(p.id).met).length;
  }
  function activeQuest(){
    if(state.quests.bell>=0&&state.quests.bell<5)return {name:"The Bell at Dusk",desc:["A strange bell was heard after midnight. Find out who rang it.","Edmund has asked you to learn who heard the bell after midnight.","Rowan remembers a cloaked figure near the abbey after dusk.","Margaret recalls a purchase of hemp cord. Ask what she knows.","Fresh fibres have been found beneath the abbey tower. Speak with Brother Anselm.","The matter has been settled."][state.quests.bell]||"Follow the mystery to its conclusion.",progress:Math.min(95,state.quests.bell*20+10),meta:"MAIN STORY · ASHENFORD"};
    if(state.quests.ledger>=0&&state.quests.ledger<2)return {name:"A Physician's Ledger",desc:state.flags.herbs&&state.flags.linen?"Return the gathered supplies to Edmund.":"Find rosemary and clean linen for the infirmary.",progress:(Number(state.flags.herbs)+Number(state.flags.linen))*40,meta:"SIDE THREAD · INFIRMARY"};
    if(state.quests.parcel===0)return {name:"A Merchant's Promise",desc:"Carry Margaret's sealed parcel to Rowan at the Fox & Lantern.",progress:45,meta:"SIDE THREAD · MARKET"};
    if(state.quests.will===0)return {name:"The Missing Courier",desc:"Search the roadside near the North Gate for a clue about Will.",progress:40,meta:"SIDE THREAD · NORTH ROAD"};
    return {name:"A Stranger in Ashenford",desc:"Explore the village, meet its inhabitants, and decide what manner of stranger you shall become.",progress:10,meta:"CHAPTER I · THE STRANGER"};
  }
  function renderEvents(){
    $("#world-events").innerHTML=state.events.slice(0,4).map((e,i)=>`<div class="event-item"><span class="event-time">${i===0?"NOW":"EARLIER"}</span><span class="event-copy">${escapeHtml(e)}</span></div>`).join("");
    $("#timeline-list").innerHTML=state.timeline.slice(0,4).map(e=>`<div class="timeline-entry"><span class="timeline-pin"></span><span class="timeline-copy"><strong>Day ${roman(e.day)} · ${e.time}</strong>${escapeHtml(e.text)}</span></div>`).join("")||'<span class="speech-hint">Your chronicle awaits its first entry.</span>';
  }
function renderGuide(){
    const q=activeQuest(),atMarket=state.location==="market",margaretHere=activeAt("margaret");
    const firstStep=state.quests.bell===0;
    const title=firstStep?"Your first step":"Your current objective";
    const description=firstStep?"Speak with Margaret at the Market Cross. Ask about the strange bell after midnight.":q.desc;
    const actionLabel=firstStep?(atMarket&&margaretHere?"Talk to Margaret":"Travel to the Market Cross"):"Open your journal";
    const action=firstStep?(atMarket&&margaretHere?"talk-margaret":"go-market"):"open-journal";
    const el=$("#guide-card");if(!el)return;
    el.innerHTML=`<div class="guide-mark">✦</div><div class="guide-copy"><span class="guide-kicker">${title}</span><strong>${escapeHtml(q.name)}</strong><p>${escapeHtml(description)}</p></div><button class="guide-action" data-guide-action="${action}">${actionLabel} <span>→</span></button>`;
    const button=el.querySelector("[data-guide-action]");
    if(button)button.addEventListener("click",()=>{
      if(action==="talk-margaret")openDialogue("margaret");
      else if(action==="go-market")travel("market");
      else openJournal();
    });
  }
    function render(){
    renderGuide();
    $("#clock-label").textContent="Day "+roman(state.day)+" · "+timeLabel();$("#header-date").textContent="THE YEAR OF OUR LORD 1348";$("#weather-label").textContent=state.day%3===0?"Cold drizzle":"Low mist";$("#role-label").textContent=state.roleName;$("#rep-value").textContent=state.reputation;$("#chapter-label").textContent="Chapter I · "+state.chapter;$("#standing-title").textContent=state.reputation;$("#standing-desc").textContent=state.reputation==="Unknown"?"No one knows your name.":"Your name is beginning to travel.";
    renderScene();renderPlaces();renderPeople();renderEvents();
    const q=activeQuest();$("#active-quest-card").innerHTML=`<div class="quest-kicker">${q.meta}</div><div class="quest-name">${q.name}</div><div class="quest-summary">${q.desc}</div><div class="quest-progress"><span style="width:${q.progress}%"></span></div><div class="quest-meta">${q.progress}% · JOURNEY RECORDED</div>`;
    $("#journal-count").textContent=Object.values(state.quests).filter(v=>v>=0).length;$("#inventory-count").textContent=state.inventory.length;
    if(state.started&&$("#start-overlay")){$("#start-overlay").classList.add("hidden");}
  }
  function travel(id){
    if(id==="keep"&&!state.flags.keepUnlocked&&state.role!=="courier"){toast("The keep's guards bar strangers from the courtyard. Speak with Serjeant Hobb.");return;}
    if(id==="keep"&&!state.flags.keepUnlocked&&state.role==="courier")state.flags.keepUnlocked=true;
    if(state.location===id)return;state.location=id;changeTime(25);addTimeline("You travelled to "+places[id].name+".");addEvent("A traveller was seen near "+places[id].short+".");render();save();toast("You have arrived at "+places[id].name+".");
  }
  function openDialogue(id){
    activePerson=id;const p=people[id],s=ps(id);s.met=true;remember(id,"You met the traveller at "+places[state.location].short+".");
    $("#dialogue-role").textContent=p.role.toUpperCase();$("#dialogue-name").textContent=p.name;$("#dialogue-status").textContent=s.opinion==="Unknown"?"They regard you with cautious interest.":s.opinion+".";$("#character-profile").innerHTML=`<div class="portrait-large">${p.icon}</div><div class="profile-name">${p.name}</div><div class="profile-role">${p.role}</div><p class="profile-lore">${p.lore}</p><div class="profile-connections"><strong>KNOWN CONNECTIONS</strong><span>${p.connections}</span></div>`;
    const log=state.dialogueLog[id]||[];if(!log.length)log.push({who:p.name,text:p.greeting});state.dialogueLog[id]=log;renderDialogue();$("#dialogue-overlay").classList.remove("hidden");renderPeople();save();
  }
  const emotionColors={fear:"#a84f45",concern:"#c79742",anger:"#c56d3c",trust:"#66835d",curiosity:"#6488a9"};
  function renderDialogue(){
    const s=ps(activePerson),p=people[activePerson],em=s.emotions;
    $("#emotion-strip").innerHTML=Object.entries(em).map(([k,v])=>`<div class="emotion-mini"><div class="emotion-mini-label"><span>${k[0].toUpperCase()+k.slice(1)}</span><span>${v}</span></div><div class="emotion-mini-track"><span style="width:${v}%;background:${emotionColors[k]}"></span></div></div>`).join("");
    $("#conversation-log").innerHTML=(state.dialogueLog[activePerson]||[]).map(line=>`<div class="speech-line ${line.who==="You"?"player":""} ${line.pending?"is-pending":""}"><span class="speech-speaker">${escapeHtml(line.pending?"THEY ARE THINKING":line.who.toUpperCase())}</span><p>${escapeHtml(line.text)}</p></div>`).join("");const conversationLog=$("#conversation-log");conversationLog.scrollTop=conversationLog.scrollHeight;
    $("#conversation-options").innerHTML=optionsFor(activePerson).map((o,i)=>`<button class="choice-button" data-choice="${i}">${escapeHtml(o.label)}</button>`).join("");
    $$("[data-choice]").forEach(b=>b.addEventListener("click",()=>respondChoice(Number(b.dataset.choice))));
  }
  function optionsFor(id){
    if(id==="anselm"&&state.quests.bell===3)return [{label:"I shall protect your secret.",action:"protect"},{label:"The village deserves the truth.",action:"expose"},{label:"Let the village hear the matter.",action:"hearing"}];
    if(id==="edmund")return [{label:"Ask about the strange bell.",action:"bell"},{label:"Ask about the physician's ledger.",action:"ledger"},{label:"Ask about his patients.",action:"patients"},{label:"Speak of modern inventions.",action:"modern"}];
    if(id==="margaret")return [{label:"Ask about the bell after dusk.",action:"bell"},{label:"Ask for work or trade.",action:"parcel"},{label:"Ask about the physician.",action:"edmund"},{label:"Speak of modern technology.",action:"modern"}];
    if(id==="rowan")return [{label:"Ask what he heard after midnight.",action:"bell"},{label:"Deliver Margaret's parcel.",action:"parcel"},{label:"Ask about Will.",action:"will"},{label:"Ask for a room.",action:"room"}];
    if(id==="mara")return [{label:"Ask about her missing cousin.",action:"will"},{label:"Tell her you found a clue.",action:"clue"},{label:"Ask about Serjeant Hobb.",action:"hobb"}];
    if(id==="hobb")return [{label:"State your business.",action:"business"},{label:"Present the royal dispatch.",action:"dispatch"},{label:"Ask about the missing courier.",action:"will"}];
    if(id==="alwyn")return [{label:"Present yourself to the steward.",action:"business"},{label:"Ask about the village stores.",action:"stores"}];
    if(id==="aldric")return [{label:"Speak of the bell mystery.",action:"kingbell"},{label:"Ask about Ashenford's troubles.",action:"troubles"}];
    return [{label:"Ask about the plague.",action:"plague"},{label:"Ask about this village.",action:"village"},{label:"Ask about the bell.",action:"bell"},{label:"Speak of modern inventions.",action:"modern"}];
  }
  function say(text,who){const log=state.dialogueLog[activePerson]||[];log.push({who:who||people[activePerson].name,text});state.dialogueLog[activePerson]=log.slice(-18);renderDialogue();save();}
  function closeDialogue(){if(activeRequestController)activeRequestController.abort();activeRequestController=null;if(pendingDialogueLine&&activePerson){const log=state.dialogueLog[activePerson]||[];const i=log.indexOf(pendingDialogueLine);if(i>=0)log.splice(i,1);}pendingDialogueLine=null;const input=$("#speech-input"),send=$("#speech-form button");if(input)input.disabled=false;if(send)send.disabled=false;$("#dialogue-overlay").classList.add("hidden");activePerson=null;render();}
  function completeBell(outcome){
    state.quests.bell=4;state.flags.ending=outcome;state.chapter="The Bell at Dusk";state.reputation=outcome==="protect"?"A Keeper of Secrets":outcome==="expose"?"Truth-Teller":"Voice of the Village";state.flags.keepUnlocked=true;
    if(outcome==="protect"){adjust("anselm",{trust:35,fear:-25});adjust("edmund",{trust:8,concern:-5});addEvent("A quiet kindness has been shown to Brother Anselm.");}
    if(outcome==="expose"){adjust("anselm",{fear:32,trust:-28,anger:12});adjust("hobb",{trust:12});addEvent("Word spreads that the abbey bell mystery has been exposed.");}
    if(outcome==="hearing"){adjust("anselm",{fear:-12,trust:14});adjust("margaret",{trust:12});addEvent("The village has been called to hear the truth together.");}
    addTimeline("You resolved The Bell at Dusk: "+({protect:"you protected Anselm",expose:"you exposed the hidden bell",hearing:"you called a village hearing"}[outcome])+".");addTimeline("The keep has opened its doors to you.");save();render();
  }
  function respondChoice(index){
    if(!activePerson)return;const id=activePerson,p=people[id],opts=optionsFor(id),o=opts[index];if(!o)return;const action=o.action;say(o.label,"You");changeTime(5);
    if(action==="protect"||action==="expose"||action==="hearing"){say(action==="protect"?"Then I shall carry this burden with thee. The bell was mine, and I rang it to guide food to the cottages beyond the mill.":"Thou wouldst have the village know? I rang the handbell to guide provisions to families kept apart from the road. I meant no deception.","");completeBell(action);say(({protect:"Thou hast shown mercy. I shall remember it, traveller.",expose:"So the truth is out. May the village judge me fairly.",hearing:"Then let them hear it from my own lips. I am weary of hiding."})[action]);renderDialogue();return;}
    if(action==="bell"){
      if(id==="edmund"){say("The abbey swears its clapper was removed. Yet a bell rang after midnight. I heard it from the infirmary window.");adjust(id,{curiosity:8,concern:6});if(state.quests.bell===0){state.quests.bell=1;addTimeline("Edmund asked you to learn who rang the bell.");}}
      else if(id==="rowan"){say("A cloaked figure crossed the yard after the second watch. I heard a small handbell, not the abbey bell.");adjust(id,{trust:5,curiosity:4});if(state.quests.bell===1){state.quests.bell=2;addTimeline("Rowan remembers a cloaked figure near the abbey.");}}
      else if(id==="margaret"){say("A length of hemp cord was bought here days ago. The buyer wore a novice's brown habit, though I saw no face.");adjust(id,{curiosity:8});if(state.quests.bell===2){state.quests.bell=3;addTimeline("Margaret recalls a novice buying hemp cord.");}}
      else {say("There are many tales of bells in Ashenford. Ask Edmund, Rowan, and Margaret, and compare their accounts.");}
    } else if(action==="ledger"){
      if(state.quests.ledger<0){state.quests.ledger=0;say("My ledger is in poor order. If thou canst bring rosemary and clean linen, I shall owe thee a favour.");addTimeline("Edmund entrusted you with a small errand for the infirmary.");}
      else if(state.flags.herbs&&state.flags.linen){state.quests.ledger=2;say("Rosemary and linen. Well gathered. Thou hast my thanks, and a little trust besides.");state.inventory=state.inventory.filter(x=>!["rosemary","linen"].includes(x.id));adjust("edmund",{trust:20,concern:-8});addTimeline("You completed A Physician's Ledger.");addEvent("Edmund has praised a traveller's help at the infirmary.");}
      else say("I still require rosemary and clean linen. Search the market stalls.");
    } else if(action==="parcel"){
      if(id==="margaret"){if(state.quests.parcel<0){state.quests.parcel=0;state.inventory.push({id:"sealed-parcel",name:"Margaret's sealed parcel",icon:"📦",desc:"A small parcel tied with twine, addressed to Rowan."});say("Take this parcel to Rowan at the Fox & Lantern. Do not open it; the contents are none of thy concern.");addTimeline("Margaret gave you a sealed parcel for Rowan.");}else say("Have Rowan received the parcel? I would know it safely delivered.");}
      else if(id==="rowan"&&state.quests.parcel===0){state.quests.parcel=1;state.inventory=state.inventory.filter(x=>x.id!=="sealed-parcel");say("Ah, Margaret's parcel. I shall see it safely put away. Tell her the old debt is remembered.");adjust("rowan",{trust:12});adjust("margaret",{trust:8});addTimeline("You delivered Margaret's sealed parcel to Rowan.");addEvent("A small debt between the merchant and innkeeper has been settled.");}
      else say("If Margaret has sent thee, I shall hear what she has to say.");
    } else if(action==="will"){
      if(id==="mara"){if(state.quests.will<0){state.quests.will=0;say("My cousin Will vanished on the northern road. If thou findest anything, bring it to me.");addTimeline("Mara asked you to search for her missing cousin Will.");}else if(state.flags.willFound){state.quests.will=2;say("This strap is his. I know the stitching. He was near the old mill road, then. Thank thee for bringing it.");adjust("mara",{trust:25,concern:-16});addTimeline("Mara recognised Will's broken satchel strap.");}else say("Search the roadside by the North Gate. He may have left a clue.");}
      else say("Mara has been asking after her cousin. The north road may hold an answer.");
    } else if(action==="clue"){if(state.flags.willFound){state.quests.will=2;say("I know this strap. Will carried it on the road. I must speak with Hobb.");adjust(id,{trust:20,concern:-10});}else say("Thou hast found no clue yet. Search the north road.");}
    else if(action==="tower"){say("A hidden handbell and frayed hemp cord. Someone has been using the tower stair.");}
    else if(action==="dispatch"){if(state.role==="courier"){state.flags.keepUnlocked=true;adjust(id,{trust:12});say("A royal seal? Very well. The keep shall receive thee. Proceed to Steward Alwyn.");}else say("A royal dispatch is not a token to be borrowed. What business hast thou with the crown?");}
    else if(action==="modern"){say(modernReply(id,"a strange device of the future"));adjust(id,{fear:10,curiosity:12});}
    else if(action==="plague"){say("There is sickness in the village, and fear travels faster than any cart. I shall speak only of what I have witnessed; rumour is no physician.");adjust(id,{concern:5});}
    else if(action==="patients"){say("The infirmary is full, though I keep my patients' names from idle tongues. Bring clean linen, and I may tell thee what help is needed.");}
    else if(action==="edmund"){say("Edmund keeps a stern count of his herbs and linens. He is not unkind, merely burdened.");}
    else if(action==="room"){say("A bed may be had for two pennies. The hearth is warm, though the roof leaks when the rain turns hard.");}
    else if(action==="hobb"){say("Hobb questions every cart that enters. He believes a strict gate keeps the village safe.");}
    else if(action==="business"){say("State thy name, thy trade, and the purpose of thy visit. Ashenford has little patience for vagabonds.");}
    else if(action==="stores"){say("The stores are lower than I would wish. The village has enough grain for the present, not for an endless winter.");}
    else if(action==="kingbell"){say("A bell that rings without its clapper? I will have the matter investigated. Bring me evidence rather than tales.");}
    else if(action==="troubles"){say("The road is uncertain, the stores are strained, and the abbey keeps its counsel. I require honest reports.");}
    else if(action==="village"){say("Ashenford is older than its walls. Its people are proud, cautious, and tired of strangers who promise much.");}
    adjust(id,{curiosity:2});renderDialogue();render();save();
  }
  function modernReply(id,subject){
    const p=people[id];
    if(id==="edmund")return "Thou speakest of a device that acts without hand or horse? I know no such art. Is this some instrument of the alchemists?";
    if(id==="margaret")return "A curious contrivance indeed. Can it weigh grain, keep accounts, or summon a buyer? If not, I see little reason to trade for it.";
    if(id==="rowan")return "If it brings music or news, perhaps the tavern might find a use for it. Yet I shall not let it near my ale.";
    if(id==="anselm")return "I shall not name every wonder witchcraft, but such a thing belongs in the hands of a careful scholar, not a frightened crowd.";
    if(id==="mara")return "I have no time for conjuring. If it can find Will, show me. If it cannot, put it away.";
    if(id==="hobb")return "No strange device shall pass the gate unexamined. Put it away and answer my questions.";
    return "Thou bringest strange wonders into my hall. Explain thy craft before I decide whether it is useful or forbidden.";
  }
async function askNoxenStudio(text,personId){
    const p=people[personId],saved=ps(personId),hint=$("#speech-hint");
    if(activeRequestController)activeRequestController.abort();
    const controller=new AbortController();activeRequestController=controller;
    pendingDialogueLine={who:p.name,text:"Listening to your words…",pending:true};
    (state.dialogueLog[personId]||(state.dialogueLog[personId]=[])).push(pendingDialogueLine);
    if(hint)hint.textContent="NOXEN Studio · composing a reply…";
    const memory=saved.memories.slice(0,3).join("; ")||"No personal memories yet.",q=activeQuest();
    const prompt=[
      "Write the next in-character NPC line for a medieval roleplaying game set in fictional Ashenford, 1348.",
      "Character: "+p.name+", "+p.role+". Personality: "+p.lore+" Connections: "+p.connections,
      "Use natural, readable medieval-leaning English. Reply in 1–3 short sentences. Stay in character; do not narrate the player's actions.",
      "Knowledge is limited to medieval life. Modern technology and slang are unfamiliar; react with believable confusion. Do not invent quest completion or contradict facts. No real-world medical advice.",
      "Emotions: "+JSON.stringify(saved.emotions)+". Memories: "+memory,
      "Place: "+places[state.location].name+". Time: Day "+state.day+" "+timeLabel()+". Player: "+state.roleName+". Quest: "+q.name+" — "+q.desc,
      "Return ONLY JSON: {\"reply\":\"...\",\"emotion_delta\":{},\"memory\":\"\"}. emotion_delta may contain fear, concern, anger, trust, curiosity integers from -6 to 6.",
      "Player says: "+text.slice(0,200)
    ].join("\n");
    const timeout=setTimeout(()=>controller.abort(),12000);
    try{
      const response=await fetch("https://noxenlabs.vercel.app/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:prompt,selectedModel:"NOXEN Studio",agentMode:false,webSearch:false,attachments:[],history:(state.dialogueLog[personId]||[]).filter(line=>!line.pending).slice(-11,-1).map(line=>({role:line.who==="You"?"user":"assistant",content:String(line.text||"").slice(0,500)}))}),signal:controller.signal});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||typeof data.answer!=="string"||!data.answer.trim())throw new Error(data.error||"NOXEN Studio is unavailable.");
      let raw=data.answer.trim(),cut=raw.indexOf("**Images from the web**");if(cut>=0)raw=raw.slice(0,cut).trim();
      raw=raw.replace(/^\`\`\`(?:json)?\s*/i,"").replace(/\s*\`\`\`$/,"").trim();
      let parsed=null;try{parsed=JSON.parse(raw);}catch{
        const first=raw.indexOf("{");if(first>=0){let depth=0,inString=false,escaped=false,last=-1;
          for(let i=first;i<raw.length;i++){const ch=raw[i];if(inString){if(escaped)escaped=false;else if(ch==="\\")escaped=true;else if(ch==='"')inString=false;}else if(ch==='"')inString=true;else if(ch==="{")depth++;else if(ch==="}"&&--depth===0){last=i+1;break;}}
          if(last>first){try{parsed=JSON.parse(raw.slice(first,last));}catch{}}
        }
      }
      let reply=typeof parsed?.reply==="string"?parsed.reply.trim():"";
      if(!reply&&!parsed)reply=raw.replace(/\[\[webimage:[\s\S]*?\]\]/g,"").replace(/\s*\*\*Images from the web\*\*[\s\S]*$/i,"").trim();
      if(!reply)throw new Error("NOXEN returned no usable dialogue.");
      if(activePerson!==personId)return;
      const log=state.dialogueLog[personId]||[],i=log.indexOf(pendingDialogueLine);if(i>=0)log.splice(i,1);pendingDialogueLine=null;
      say(reply.slice(0,700));
      const delta=parsed?.emotion_delta&&typeof parsed.emotion_delta==="object"?parsed.emotion_delta:{},safeDelta={};
      ["fear","concern","anger","trust","curiosity"].forEach(k=>{const n=Number(delta[k]);if(Number.isFinite(n))safeDelta[k]=Math.max(-6,Math.min(6,Math.round(n)));});
      adjust(personId,safeDelta);if(typeof parsed?.memory==="string"&&parsed.memory.trim())remember(personId,parsed.memory.trim().slice(0,140));
      remember(personId,"You said: "+text.slice(0,90));renderDialogue();render();save();
      if(hint)hint.textContent="NOXEN Studio · Character roleplay";
    }catch(error){
      if(activePerson!==personId)return;
      const log=state.dialogueLog[personId]||[],i=log.indexOf(pendingDialogueLine);if(i>=0)log.splice(i,1);pendingDialogueLine=null;
      if(hint)hint.textContent="Local character reply · NOXEN Studio unavailable";
      reactToFreeText(text,true);
    }finally{clearTimeout(timeout);if(activeRequestController===controller)activeRequestController=null;}
  }
  function handlePlayerSpeech(text){
    const value=String(text||"").trim();if(!value||!activePerson||value.length>240||activeRequestController)return;
    const personId=activePerson;say(value,"You");changeTime(3);save();
    const input=$("#speech-input"),send=$("#speech-form button");if(input)input.disabled=true;if(send)send.disabled=true;
    askNoxenStudio(value,personId).finally(()=>{if(input)input.disabled=false;if(send)send.disabled=false;});
  }
    function reactToFreeText(text,alreadyLogged=false){
    const t=text.trim();if(!t||!activePerson)return;if(t.length>240)return;if(!alreadyLogged){say(t,"You");changeTime(3);}
    const low=t.toLowerCase(),id=activePerson,p=people[id];let reply="";
    if(/phone|smartphone|computer|laptop|internet|wifi|wi-fi|google|ai\b|robot|electric|electricity|satellite|car\b|engine|camera|app\b/.test(low)){reply=modernReply(id,t);adjust(id,{fear:8,curiosity:14});remember(id,"You spoke of a strange modern invention.");}
    else if(/bro|bruh|lol|lmao|no cap|cooked|ate|slay|rizz|fr|ngl|idk/.test(low)){reply="Good heavens! What peculiar cant is this? Speak plainly, traveller; I cannot make sense of half these clipped expressions.";adjust(id,{anger:4,curiosity:5});}
    else if(/plague|sick|ill|disease|fever/.test(low)){reply="The sickness has cast a long shadow over Ashenford. I shall not trust every rumour, but the fear in the cottages is plain.";adjust(id,{concern:8});}
    else if(/bell|ring|midnight|tower/.test(low)){reply=id==="anselm"?"The abbey bell is silent by order. I pray thou wilt not ask why the tower stair is watched.": "The bell was heard after midnight. Ask those who were awake, and listen for what they do not say.";if(state.quests.bell===0){state.quests.bell=1;addTimeline("You began investigating the strange bell.");}}
    else if(/thank|thanks/.test(low)){reply="Thou art welcome. A courteous word is a rare coin in these troubled times.";adjust(id,{trust:4,anger:-3});}
    else if(/sorry|apolog/.test(low)){reply="Let the matter rest. We have little cause to quarrel, provided thou speakest with care.";adjust(id,{trust:5,anger:-8});}
    else if(/who are you|your name|what is your name/.test(low)){reply="I am "+p.name+", "+p.role.toLowerCase()+". My place in Ashenford is known to those who have reason to seek me.";}
    else if(/help|quest|task|job|work/.test(low)){reply="There is always work for an honest pair of hands. Speak with the folk of the market, the infirmary, and the tavern; each has a burden to share.";adjust(id,{curiosity:4});}
    else if(/king|queen|royal|castle|keep/.test(low)){reply="The keep overlooks us all. King Aldric expects loyalty, while Steward Alwyn expects his accounts to be exact.";}
    else {reply=p.voice==="royal"?"Choose thy words carefully. I shall hear thee, though I cannot promise favour.":p.voice==="warm"?"Aye, I hear thee. Tell me more, and I shall see whether I can be of service.":"I hear thee, traveller, though thy meaning is not yet clear. Speak further, and be plain.";}
    say(reply);remember(id,"You said: "+t.slice(0,90));adjust(id,{curiosity:2});renderDialogue();render();save();
  }
  function sceneAction(action){
    if(action==="tower"){
      state.flags.sawFibres=true;state.quests.bell=3;state.inventory.push({id:"hemp-fibres",name:"Frayed hemp fibres",icon:"🧵",desc:"A length of cord caught beneath the abbey stair."});addTimeline("You found fresh hemp fibres beneath the abbey bell tower.");addEvent("Fresh cord fibres suggest someone has used the old tower stair.");adjust("anselm",{fear:8,concern:4});toast("Evidence found: frayed hemp fibres.");
    }
    if(action==="herbs"||action==="linen"){
      const herb=action==="herbs";state.flags[herb?"herbs":"linen"]=true;const id=herb?"rosemary":"linen";if(!state.inventory.some(i=>i.id===id))state.inventory.push({id,name:herb?"Dried rosemary":"Clean linen",icon:herb?"🌿":"🧺",desc:herb?"A fragrant bundle from a market stall.":"Fresh linen wrapped in brown paper."});addTimeline("You gathered "+(herb?"rosemary":"clean linen")+" for the infirmary.");toast(herb?"Rosemary gathered.":"Clean linen collected.");
    }
    if(action==="will"){
      state.flags.willFound=true;state.inventory.push({id:"broken-strap",name:"Broken satchel strap",icon:"🪢",desc:"A familiar leather strap found beside the northern road."});addTimeline("You found a broken satchel strap on the northern road.");addEvent("A broken strap has been found near the north road.");adjust("mara",{concern:5,curiosity:8});toast("You found a clue about Will.");
    }
    render();save(true);
  }
  function openModal(title,content,eyebrow){
    $("#modal-title").textContent=title;$("#modal-eyebrow").textContent=eyebrow||"YOUR CHRONICLE";$("#modal-content").innerHTML=content;$("#modal-overlay").classList.remove("hidden");
  }
  function closeModal(){$("#modal-overlay").classList.add("hidden");}
  function openJournal(){
    const entries=[
      {name:"The Bell at Dusk",desc:"Investigate the strange ringing heard after midnight. Compare the accounts of Edmund, Rowan, and Margaret before visiting the abbey tower.",status:state.quests.bell===4?"Resolved":state.quests.bell>0?"In progress":"Undiscovered",objective:state.quests.bell===4?"Resolved: "+state.flags.ending:state.quests.bell===3?"Examine the tower and speak with Anselm.":"Speak with the physician and the villagers."},
      {name:"A Physician's Ledger",desc:"Gather rosemary and clean linen for Edmund at the infirmary.",status:state.quests.ledger===2?"Completed":state.quests.ledger>=0?"In progress":"Undiscovered",objective:state.quests.ledger===2?"Supplies delivered.":"Gather both items at the market and return to Edmund."},
      {name:"A Merchant's Promise",desc:"Carry Margaret's sealed parcel to Rowan at the Fox & Lantern.",status:state.quests.parcel===1?"Completed":state.quests.parcel===0?"In progress":"Undiscovered",objective:state.quests.parcel===1?"Parcel delivered.":"Speak with Margaret, then visit Rowan."},
      {name:"The Missing Courier",desc:"Help Mara find her cousin Will, last seen on the northern road.",status:state.quests.will===2?"Clue found":state.quests.will>=0?"In progress":"Undiscovered",objective:state.quests.will===2?"Mara recognised the satchel strap.":"Ask Mara and search the roadside at the gate."}
    ];
    openModal("Journal & quests",entries.map(q=>`<article class="journal-quest"><div class="quest-kicker">${q.status.toUpperCase()}</div><h3>${q.name}</h3><p>${q.desc}</p><div class="objective">CURRENT THREAD · ${q.objective}</div></article>`).join("")+`<h3 style="font:600 22px Georgia;margin:18px 0 8px">Chronicle of events</h3>`+state.timeline.map(e=>`<div class="timeline-entry" style="margin:8px 0"><span class="timeline-pin"></span><div class="timeline-copy" style="color:#594b34"><strong>Day ${roman(e.day)} · ${e.time}</strong>${escapeHtml(e.text)}</div></div>`).join(""),"JOURNAL & CHRONICLES");
  }
  function openPeople(){
    const cards=Object.values(people).map(p=>`<div class="person-sheet"><span class="mini-portrait">${p.icon}</span><div><strong>${p.name}</strong><br/><small>${p.role} · ${ps(p.id).met?"Met":"Unmet"}</small><p>${p.lore}</p><small>Opinion: ${ps(p.id).opinion}</small></div></div>`).join("");
    openModal("People of Ashenford",`<div class="journal-grid">${cards}</div>`,"THE SETTLEMENT");
  }
  function openInventory(){openModal("Your satchel",`<div class="inventory-grid">${state.inventory.map(i=>`<div class="inventory-item"><span>${i.icon}</span><strong>${escapeHtml(i.name)}</strong><small>${escapeHtml(i.desc)}</small></div>`).join("")||"<p>Your satchel is empty.</p>"}</div>`,"BELONGINGS & FINDS");}
function openMap(){
    const nodes=[
      {id:"gate",x:120,y:245,icon:"⚑",label:"North Gate",sub:"The northern road"},
      {id:"infirmary",x:285,y:365,icon:"✚",label:"Infirmary",sub:"St. Brigid's"},
      {id:"market",x:455,y:270,icon:"⚖",label:"Market Cross",sub:"Village centre"},
      {id:"tavern",x:625,y:385,icon:"♨",label:"Fox & Lantern",sub:"Village tavern"},
      {id:"abbey",x:445,y:105,icon:"✟",label:"Abbey",sub:"St. Cuthbert's"},
      {id:"keep",x:770,y:125,icon:"♜",label:"The Keep",sub:"Lord's residence"}
    ];
    const paths=nodes.map(n=>{
      const locked=n.id==="keep"&&!state.flags.keepUnlocked&&state.role!=="courier";
      return `<g class="map-node ${state.location===n.id?"is-current":""} ${locked?"is-locked":""}" data-map-place="${n.id}" role="button" tabindex="${locked?-1:0}" aria-label="${n.label}${locked?", locked":""}" aria-disabled="${locked}">
        <circle class="map-node-halo" cx="${n.x}" cy="${n.y}" r="34"/>
        <circle class="map-node-disc" cx="${n.x}" cy="${n.y}" r="25"/>
        <text class="map-node-icon" x="${n.x}" y="${n.y+7}" text-anchor="middle">${n.icon}</text>
        <text class="map-node-label" x="${n.x}" y="${n.y+49}" text-anchor="middle">${n.label}</text>
        <text class="map-node-sub" x="${n.x}" y="${n.y+64}" text-anchor="middle">${locked?"Requires an invitation":n.sub}</text>
      </g>`;
    }).join("");
    const map=`<div class="map-intro"><span>✦ ASHENFORD · 1348</span><p>Choose a marked place to travel. The gold ring shows where you are now.</p></div>
      <div class="illustrated-map-wrap"><svg class="illustrated-map" viewBox="0 0 900 520" role="group" aria-label="Illustrated map of Ashenford village">
        <defs>
          <pattern id="map-grain" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1" fill="#6f684e" opacity=".18"/><circle cx="17" cy="16" r=".8" fill="#6f684e" opacity=".15"/></pattern>
          <linearGradient id="map-paper" x2="0" y2="1"><stop stop-color="#e7d9b9"/><stop offset="1" stop-color="#cdb98f"/></linearGradient>
        </defs>
        <rect width="900" height="520" rx="10" fill="url(#map-paper)"/><rect width="900" height="520" rx="10" fill="url(#map-grain)"/>
        <path class="map-river" d="M-20 425 C130 350 175 455 295 405 S485 340 570 400 S760 480 930 390"/>
        <path class="map-road" d="M80 245 C185 220 265 270 360 270 S540 275 650 385 M455 270 C440 210 430 160 445 105 M455 270 C565 210 665 160 770 125 M455 270 C370 300 320 335 285 365 M455 270 C330 220 205 220 120 245"/>
        <path class="map-road-edge" d="M80 245 C185 220 265 270 360 270 S540 275 650 385 M455 270 C440 210 430 160 445 105 M455 270 C565 210 665 160 770 125 M455 270 C370 300 320 335 285 365 M455 270 C330 220 205 220 120 245"/>
        <g class="map-woods" opacity=".75"><path d="M35 70l18 36 18-36 18 36 18-36M690 275l18 36 18-36 18 36 18-36M115 440l18 36 18-36 18 36 18-36" fill="none" stroke="#718065" stroke-width="8" stroke-linecap="round"/></g>
        <g class="map-decoration"><text x="34" y="36">N</text><path d="M42 45l-9 19h18z" /><text x="34" y="500">ASHENFORD COMMON</text><text x="720" y="495">THE RIVER ALD</text></g>
        <g class="map-buildings"><path d="M392 60l53-37 53 37v32H392z"/><path d="M720 80l50-34 50 34v34H720z"/><path d="M245 330l40-30 40 30v26h-80z"/><path d="M585 350l40-30 40 30v26h-80z"/><path d="M80 220l40-28 40 28v24H80z"/></g>
        ${paths}
      </svg></div><div class="map-legend"><span><i class="legend-current"></i> Your location</span><span><i class="legend-road"></i> Village roads</span><span><i class="legend-locked"></i> Restricted</span></div>`;
    openModal("Village map",map,"FIND YOUR WAY");
    const selectNode=(el)=>{if(!el||el.classList.contains("is-locked"))return;const id=el.dataset.mapPlace;closeModal();travel(id);};
    $$(".map-node").forEach(el=>{
      el.addEventListener("click",()=>selectNode(el));
      el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectNode(el);}});
    });
  }
  function openSettings(){
    openModal("Chronicle settings",`<div class="setting-row"><span>Autosave</span><strong>ON · This device</strong></div><div class="setting-row"><span>Current chapter</span><strong>${escapeHtml(state.chapter)}</strong></div><div class="setting-row"><span>Export your progress</span><button id="modal-export">Download save</button></div><div class="setting-row"><span>Start a new chronicle</span><button id="reset-save">Reset game</button></div><p style="font:italic 11px/1.5 Georgia;color:#69583d;margin-top:15px">This build stores progress in this browser. Export a save file before clearing browser data or moving to another device. NOXEN Studio powers character dialogue when available. Progress is saved in this browser; export a save before changing devices.</p>`,"SETTINGS");
    $("#modal-export").addEventListener("click",exportSave);
    $("#reset-save").addEventListener("click",()=>{if(confirm("Begin a new chronicle? Your current local save will be replaced. Export it first if you wish to keep it.")){localStorage.removeItem(SAVE_KEY);state=defaultState();activePerson=null;closeModal();selectedRole="traveller";$("#start-overlay").classList.remove("hidden");$$(".role-option").forEach(b=>b.classList.toggle("selected",b.dataset.role==="traveller"));render();}});
  }
  function exportSave(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="victorian-academy-ashenford-save.json";a.click();URL.revokeObjectURL(url);toast("Save file prepared.");}
  function begin(){
    state=defaultState();state.started=true;state.role=selectedRole;state.roleName=roles[selectedRole].name;state.chapter="The Stranger";
    if(selectedRole==="apprentice")state.inventory.push({id:"herb-pouch",name:"Apprentice herb pouch",icon:"🌿",desc:"A pouch of dried common herbs."});
    if(selectedRole==="merchant")state.inventory.push({id:"trade-token",name:"Trade token",icon:"⚖",desc:"A wooden token bearing a merchant's mark."});
    if(selectedRole==="courier"){state.inventory.push({id:"royal-letter",name:"Sealed royal letter",icon:"✉",desc:"A letter bearing the royal seal."});state.flags.keepUnlocked=true;}
    addTimeline(roles[selectedRole].intro);addEvent("A stranger has arrived in Ashenford. The market has noticed.");$("#start-overlay").classList.add("hidden");render();save();toast("Your chronicle begins. Margaret Whitmore is at the market.");
  }
  function resume(){if(load()){$("#start-overlay").classList.add("hidden");render();toast("Your chronicle has been restored.");}else begin();}
  function wire(){
    $$(".nav-item").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.view;activeTab=v;$$(".nav-item").forEach(n=>n.classList.toggle("active",n===b));if(v==="world")toast("You are exploring Ashenford.");if(v==="journal")openJournal();if(v==="people")openPeople();if(v==="inventory")openInventory();}));
    $("#begin-game").addEventListener("click",begin);$("#continue-game").addEventListener("click",resume);
    $$(".role-option").forEach(b=>b.addEventListener("click",()=>{selectedRole=b.dataset.role;$$(".role-option").forEach(x=>x.classList.toggle("selected",x===b));}));
    $("#close-dialogue").addEventListener("click",closeDialogue);$("#dialogue-overlay").addEventListener("click",e=>{if(e.target===$("#dialogue-overlay"))closeDialogue();});
    $("#speech-form").addEventListener("submit",e=>{e.preventDefault();const input=$("#speech-input"),value=input.value;input.value="";handlePlayerSpeech(value);});
    $("#scene-hotspots").addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(b)sceneAction(b.dataset.action);});
    $("#map-toggle").addEventListener("click",openMap);$("#wait-button").addEventListener("click",()=>{changeTime(60);addTimeline("You let an hour pass in Ashenford.");addEvent("The day continues, indifferent to the worries of its people.");render();save(true);});
    $("#all-people-button").addEventListener("click",openPeople);$("#journal-button").addEventListener("click",openJournal);$("#close-modal").addEventListener("click",closeModal);$("#modal-overlay").addEventListener("click",e=>{if(e.target===$("#modal-overlay"))closeModal();});
    $("#settings-button").addEventListener("click",openSettings);$("#export-save").addEventListener("click",exportSave);$("#sound-toggle").addEventListener("click",()=>toast("Ambient sound is planned for a later chronicle."));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("#dialogue-overlay").classList.contains("hidden"))closeDialogue();else if(!$("#modal-overlay").classList.contains("hidden"))closeModal();}});
  }
  wire();
  if(load()){$("#continue-game").classList.remove("hidden");$("#begin-game").textContent="Begin a new chronicle";$("#start-overlay").classList.remove("hidden");}
  render();
})();