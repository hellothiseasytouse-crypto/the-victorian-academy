(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const SAVE_KEY = "tva-ashenford-save-v1";
  const clamp = (n) => Math.max(0, Math.min(100, n));
  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const roles = {
    traveller:{name:"Wayfarer",station:"A stranger with no known household rank or local allegiance.",intro:"You have come to Ashenford with little more than a weatherworn cloak and a stranger's name."},
    apprentice:{name:"Healer's apprentice",station:"A healer's apprentice: useful in the infirmary, but still learning and not a master physician.",intro:"Your training has brought you to Ashenford. The scent of rosemary follows your satchel."},
    merchant:{name:"Merchant's kin",station:"A member of a trading household, expected to understand bargains, promises, and fair measures.",intro:"A family token and a keen eye for bargains mark you as kin to a trading household."},
    courier:{name:"Royal courier",station:"A bearer of royal dispatches, entitled to formal courtesy but still answerable for the letter entrusted to you.",intro:"A sealed letter rests inside your coat. Its destination is the keep above the village."}
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
    edmund:{id:"edmund",name:"Edmund Blackthorn",role:"Plague physician",icon:"⚕",age:46,location:"infirmary",lore:"A severe physician with a guarded heart. He trusts evidence, routine, and very few people.",connections:"Margaret supplies his herbs. Brother Anselm sometimes brings him food for the sick.",greeting:"Mind the doorway, please. We have patients sleeping inside. Are you here for treatment, or have you brought news?",emotions:{fear:12,concern:48,anger:18,trust:16,curiosity:54},voice:"formal"},
    margaret:{id:"margaret",name:"Margaret Whitmore",role:"Merchant",icon:"⚖",age:39,location:"market",lore:"A quick-witted trader who remembers every debt, promise, and face that passes her stall.",connections:"Rowan keeps her parcels at the tavern. Edmund is one of her oldest customers.",greeting:"Morning. If you're buying, come closer. If you're only looking, mind the baskets; I have enough to count already.",emotions:{fear:8,concern:26,anger:12,trust:30,curiosity:68},voice:"sharp"},
    rowan:{id:"rowan",name:"Rowan Pike",role:"Innkeeper",icon:"♨",age:52,location:"tavern",lore:"A patient listener who has heard more secrets than he admits. He remembers what is said after the second cup.",connections:"Margaret trusts him with parcels. Mara's brother once worked in his stables.",greeting:"Shut the door behind you, will you? The fire's barely keeping up with this damp. Need a room, a meal, or something else?",emotions:{fear:10,concern:35,anger:8,trust:36,curiosity:45},voice:"warm"},
    anselm:{id:"anselm",name:"Brother Anselm",role:"Abbey novice",icon:"✟",age:24,location:"abbey",lore:"A quiet novice whose hands are more accustomed to carrying supplies than copying scripture.",connections:"He brings provisions to Edmund's patients. Rowan has seen him near the north road.",greeting:"I'm meant to be taking these supplies to the infirmary. Are you looking for the prior, or someone else?",emotions:{fear:42,concern:58,anger:4,trust:20,curiosity:34},voice:"gentle"},
    mara:{id:"mara",name:"Mara Fenwick",role:"Washerwoman",icon:"✺",age:31,location:"gate",lore:"Practical, observant, and fiercely loyal to her missing cousin Will.",connections:"Rowan employed Will in the stables. Serjeant Hobb questioned him last week.",greeting:"Have you come from the north road? I'm looking for my cousin. His name is Will. Please, tell me if you've seen him.",emotions:{fear:30,concern:78,anger:25,trust:24,curiosity:40},voice:"direct"},
    hobb:{id:"hobb",name:"Serjeant Hobb",role:"Gate serjeant",icon:"⚔",age:44,location:"gate",lore:"A disciplined guard who follows orders, watches strangers, and dislikes disturbances at the gate.",connections:"He reports to Steward Alwyn and has a long-standing quarrel with Rowan.",greeting:"Stop there. Name and business, please. The road has been unsafe after dark, and I need to know who comes through.",emotions:{fear:8,concern:22,anger:26,trust:15,curiosity:19},voice:"stern"},
    alwyn:{id:"alwyn",name:"Steward Alwyn",role:"Keeper of accounts",icon:"▤",age:57,location:"keep",lore:"The steward controls the keep's stores and knows the value of every sack of grain.",connections:"He serves King Aldric and quietly relies on Margaret's market reports.",greeting:"I'm in the middle of the stores account. What matter have you brought, and can it wait until I've finished this line?",emotions:{fear:4,concern:19,anger:22,trust:12,curiosity:35},voice:"measured"},
    aldric:{id:"aldric",name:"King Aldric III",role:"Lord of Ashenford",icon:"♜",age:49,location:"keep",lore:"A proud ruler facing pressure from the road, the abbey, and the village households.",connections:"Steward Alwyn manages his stores. He has heard reports of the strange bell.",greeting:"You have a moment. Make your business clear; I have reports waiting from the road and the storehouse.",emotions:{fear:2,concern:42,anger:17,trust:8,curiosity:28},voice:"royal"}
  };
  const npcProfiles={
    edmund:{manner:"He keeps his sleeves rolled, washes his hands often, and speaks in short, exact sentences. He is tired, observant and impatient with careless claims.",concern:"He has too many patients and too little clean linen. He is afraid that people will mistake confidence for knowledge.",knowledge:"He knows what he has personally seen in the infirmary and what Margaret supplies. He does not know the abbey's private business unless someone told him.",politics:"He is not a party man. He wants the infirmary supplied and will support a fair audit, but he dislikes being drawn into court gossip."},
    margaret:{manner:"She is quick with figures and notices small changes in people's stories. She can be dryly funny, but does not waste time flattering customers.",concern:"She is protecting her stock and reputation while trade becomes uncertain. She dislikes unpaid debts and vague promises.",knowledge:"She knows market prices, customers, deliveries and gossip she has heard directly. She distinguishes what she witnessed from what someone merely told her.",politics:"She wants honest weights and accounts. She favours a public hearing if the figures do not add up, but fears a disorderly change of rule would ruin trade."},
    rowan:{manner:"He is slow to interrupt, often answers while doing another task, and uses plain words. He has a dry sense of humour and dislikes being pressed in front of customers.",concern:"He wants the inn to stay open and his regulars to keep trusting him. He avoids taking sides in quarrels that could cost him trade.",knowledge:"He knows what happened in the tavern, stable yard and nearby roads from guests. He does not know private matters unless someone confided in him.",politics:"He dislikes public quarrels and wants the roads safe for travellers. He may support fair treatment of carters, but will not casually risk his inn by joining a faction."},
    anselm:{manner:"He is young, conscientious and easily flustered when questioned about things he would rather keep private. He pauses before answering and rarely makes a grand speech.",concern:"He worries about the people receiving food and about disappointing the abbey. He is not fearless or endlessly patient.",knowledge:"He knows the abbey's ordinary routines and the supplies he carries. He knows only what he personally witnessed about the bell and the road.",politics:"He cares about the hungry households more than court titles. He fears the abbey being pulled into a struggle for power and prefers a hearing over rumours."},
    mara:{manner:"She watches the road while she speaks. Her answers are direct; worry may make her impatient, but she does not turn every conversation into a speech.",concern:"She wants news of her cousin Will and needs to keep earning a living. Empty reassurance makes her more frustrated, not more grateful.",knowledge:"She knows Will, his habits and the places he used to visit. She cannot identify clues she has not seen.",politics:"She wants the promised grain for working households and is angry at being ignored. She may back a petition, but she is not automatically devoted to any replacement ruler."},
    hobb:{manner:"He is formal on duty, alert to evasions, and more interested in clear answers than charming words. He does not trust strangers simply because they are polite.",concern:"He is responsible for the gate and fears being blamed if he lets trouble into the village.",knowledge:"He knows gate records, travellers he has questioned and instructions from the keep. He does not automatically know what happens inside the abbey or tavern.",politics:"He is loyal to the office of the crown and to public order, not blindly loyal to every officer. He requires a written warrant before opening official records."},
    alwyn:{manner:"He is precise, economical with words and easily distracted by unfinished accounts. He values evidence, proper procedure and people who do what they said they would.",concern:"He is trying to make the stores last without alarming the household or the village.",knowledge:"He knows inventories, deliveries, orders and reports brought to him. He does not know every private conversation in Ashenford.",politics:"He believes the village must accept the steward's decisions. He presents the diverted grain as necessary reserves and becomes guarded when someone asks for a second account."},
    aldric:{manner:"He is a ruler with limited time, not a theatrical villain. He listens when evidence matters, becomes curt when interrupted, and rarely explains himself at length.",concern:"He is balancing food stores, road safety and the abbey's influence. He worries about disorder spreading faster than the sickness.",knowledge:"He knows official reports and matters brought before his household. Rumours are not facts to him.",politics:"He values order and believes the crown is necessary, but understands that authority depends on people accepting its decisions. He approved a reserve and failed to check how it was administered."}
  };
  function defaultState(){
    const npc={}; for(const p of Object.values(people)) npc[p.id]={met:false,meetings:0,firstMetDay:0,lastMetDay:0,lastMetMinute:null,lastMetPlace:"",emotions:{...p.emotions},memories:[],opinion:"Unknown"};
    return {version:1,started:false,role:"traveller",roleName:"Wayfarer",location:"market",day:1,minute:555,chapter:"The Stranger",reputation:"Unknown",inventory:[{id:"travel-cloak",name:"Weatherworn cloak",icon:"🧥",desc:"A sturdy cloak, damp from the road."}],quests:{bell:0,ledger:-1,parcel:-1,will:-1},flags:{sawFibres:false,herbs:false,linen:false,willFound:false,keepUnlocked:false,ending:""},politics:{grievances:[],evidence:[],signatures:[],inquiryOpened:false,stewardQuestioned:false,kingConfronted:false,petitionStarted:false,audiencePass:false,stewardRemoved:false,outcome:"",kingResponse:"",assemblyCalled:false},npc,events:["The market is waking beneath a veil of mist.","A bell was heard after midnight, though the abbey says its clapper is removed."],timeline:[],dialogueLog:{},lastSaved:0};
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
    try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;const saved=JSON.parse(raw);if(!saved||saved.version!==1)return false;state={...defaultState(),...saved,politics:{...defaultState().politics,...(saved.politics||{})},npc:{...defaultState().npc,...saved.npc}};state.politics.grievances=Array.isArray(state.politics.grievances)?state.politics.grievances:[];state.politics.evidence=Array.isArray(state.politics.evidence)?state.politics.evidence:[];state.politics.signatures=Array.isArray(state.politics.signatures)?state.politics.signatures:[];Object.keys(state.npc).forEach(id=>{state.npc[id]={...defaultState().npc[id],...state.npc[id],emotions:{...defaultState().npc[id].emotions,...(state.npc[id].emotions||{})}};});return !!state.started;}catch(e){return false;}
  }
  function addTimeline(text){state.timeline.unshift({day:state.day,time:timeLabel(),text});state.timeline=state.timeline.slice(0,12);save();}
  function addEvent(text){state.events.unshift(text);state.events=state.events.slice(0,5);save();}
  function changeTime(minutes){
    const start=(state.day-1)*1440+state.minute;
    const end=start+Math.max(0,Number(minutes)||0);
    const oldDay=state.day;
    state.day=Math.floor(end/1440)+1;
    state.minute=end%1440;
    for(let hourMark=Math.floor(start/60)+1;hourMark<=Math.floor(end/60);hourMark++){
      const hour=hourMark%24,day=Math.floor(hourMark/24)+1;
      if(hour===6)addEvent("Shutters open along the market street. Carts begin arriving from the farms.");
      if(hour===12)addEvent("The abbey bell marks noon. Traders pause briefly, and the square grows loud again.");
      if(hour===18)addEvent("The market stalls are being covered. Unsold food is packed away before the light fades.");
      if(hour===21)addEvent("The north gate is being closed for the night. Late travellers are asked to wait until morning.");
      if(hour===0&&day>oldDay){addEvent("Another cold dawn is not far away. The night watch changes at the gate.");addTimeline("Day "+day+" begins in Ashenford.");}
    }
  }
  function ps(id){return state.npc[id];}
  function remember(id,text){const p=ps(id);p.memories.unshift(text);p.memories=p.memories.slice(0,5);}
  function relationshipFor(id){
    const e=ps(id).emotions,trust=e.trust||0,fear=e.fear||0,anger=e.anger||0;
    if(fear>=72)return {title:"Avoids your company",summary:"They keep their distance and watch what you do.",trust};
    if(anger>=72)return {title:"Still bears a grudge",summary:"Something between you remains unresolved. A polite word will not erase it.",trust};
    if(trust>=88)return {title:"Would vouch for you",summary:"They have seen you follow through when it mattered.",trust};
    if(trust>=72)return {title:"Trusts your word",summary:"They are willing to share concerns and ask for your help.",trust};
    if(trust>=55)return {title:"Respects you",summary:"They take you seriously, though they still make up their own mind.",trust};
    if(trust>=38)return {title:"Knows you by sight",summary:"They recognise you and remember how you have dealt with them.",trust};
    if(fear>=45)return {title:"Wary of you",summary:"They remain guarded and watch for signs of trouble.",trust};
    if(anger>=35)return {title:"Irritated with you",summary:"Your last dealings left them displeased.",trust};
    return {title:ps(id).met?"On speaking terms":"A stranger",summary:ps(id).met?"They know who you are, but have little reason to rely on you yet.":"They have no reason to know or trust you yet.",trust};
  }
  function adjust(id,delta){
    const e=ps(id).emotions;Object.entries(delta).forEach(([k,v])=>{if(k in e)e[k]=clamp(e[k]+v);});
    ps(id).opinion=relationshipFor(id).title;
  }
  function dayPart(){
    const h=Math.floor(state.minute/60);
    if(h<5)return "late night";if(h<7)return "dawn";if(h<11)return "morning";if(h<14)return "midday";if(h<18)return "afternoon";if(h<21)return "evening";return "night";
  }
  function weatherForToday(){
    const cycle=[
      {label:"Low mist",detail:"Mist hangs close to the ground and softens the distant roofs."},
      {label:"Cold drizzle",detail:"A thin drizzle darkens wool, timber and the ruts in the road."},
      {label:"Broken cloud",detail:"Pale light comes and goes between low clouds."},
      {label:"Steady rain",detail:"Rain runs from the eaves and gathers in the cart tracks."},
      {label:"Clear and cold",detail:"The air is sharp, but the rooftops are visible beyond the village."}
    ];
    return cycle[(state.day-1)%cycle.length];
  }
  function routineFor(id){
    const h=Math.floor(state.minute/60),day=state.day;
    switch(id){
      case "edmund":
        if(h>=5&&h<12)return {place:"infirmary",activity:"checking patients and preparing remedies",available:true};
        if(h>=12&&h<13)return {place:"market",activity:"buying linen and herbs for the infirmary",available:true};
        if(h>=13&&h<21)return {place:"infirmary",activity:h<17?"tending patients":"counting supplies and checking the fever ward",available:true};
        return {place:"infirmary",activity:"resting between night calls",available:false};
      case "margaret":
        if(h>=6&&h<18)return {place:"market",activity:h<9?"setting out her goods":h<16?"weighing goods and keeping her accounts":"covering the stall and counting the day's takings",available:true};
        if(h>=18&&h<20&&day%2===0)return {place:"tavern",activity:"settling a trade account with Rowan",available:true};
        return {place:"market",activity:"away from the stall",available:false};
      case "rowan":
        if(h>=5&&h<7)return {place:"market",activity:"collecting bread and provisions",available:true};
        if(h>=7&&h<23)return {place:"tavern",activity:h<11?"laying the fire and preparing the kitchen":h<17?"serving the room and keeping the accounts":"serving supper and listening to the evening talk",available:true};
        return {place:"tavern",activity:"closing the inn for the night",available:false};
      case "anselm":
        if(h>=5&&h<14)return {place:"abbey",activity:h<8?"carrying water and preparing the chapel":"copying notes and moving supplies around the abbey",available:true};
        if(h>=14&&h<17)return {place:"infirmary",activity:"delivering food and clean cloth to the sick",available:true};
        if(h>=17&&h<20)return {place:"abbey",activity:"returning supplies and helping with evening prayers",available:true};
        return {place:"abbey",activity:"at rest in the abbey",available:false};
      case "mara":
        if(h>=6&&h<8)return {place:"gate",activity:"checking the northern road for news of Will",available:true};
        if(h>=8&&h<10)return {place:"market",activity:"collecting washing and speaking with customers",available:true};
        if(h>=10&&h<17)return {place:"gate",activity:"watching the road between loads of washing",available:true};
        return {place:"gate",activity:"away at work or searching the road",available:false};
      case "hobb":
        if(h>=5&&h<13)return {place:"gate",activity:h<9?"checking carts and questioning early travellers":"keeping the register and speaking with people at the gate",available:true};
        if(h>=13&&h<14)return {place:"keep",activity:"giving the midday gate report to the steward",available:true};
        if(h>=14&&h<21)return {place:"gate",activity:"keeping watch and checking the road",available:true};
        return {place:"gate",activity:"off duty at the gatehouse",available:false};
      case "alwyn":
        if(h>=7&&h<12)return {place:"keep",activity:"checking the stores and the day's accounts",available:true};
        if(h>=13&&h<18)return {place:"keep",activity:"meeting petitioners and reviewing deliveries",available:true};
        return {place:"keep",activity:"away from the steward's office",available:false};
      case "aldric":
        if(h>=9&&h<12)return {place:"keep",activity:"hearing petitions and receiving reports",available:true};
        if(h>=14&&h<18)return {place:"keep",activity:"meeting his council and reviewing the village's needs",available:true};
        return {place:"keep",activity:"not receiving visitors",available:false};
      default:return {place:people[id]?.location||state.location,activity:"going about their usual work",available:true};
    }
  }
  function ambientForPlace(id){
    const part=dayPart();
    const ambience={
      market:{dawn:"The first carts are arriving; stallholders are lifting damp covers and sorting the morning's goods.",morning:"Buyers move between the stalls, comparing prices and making room for passing carts.",midday:"The square is busiest now. Sellers call out prices over the noise of animals and bargaining.",afternoon:"The crowd is thinning. Stallholders begin putting aside what has not sold.",evening:"Most stalls are covered, and the square is quieter than it was an hour ago.",night:"The shutters are closed. Only the watch and an occasional late cart disturb the square."},
      infirmary:{dawn:"The room smells of damp straw, boiled linen and yesterday's herbs. The first patients are being checked.",morning:"There is little room between the beds. A kettle is warming near the hearth.",midday:"A servant has brought food; the physician is trying to keep the room orderly.",afternoon:"The light is fading at the narrow windows. Visitors speak quietly near the beds.",evening:"The patients are settling. Footsteps and low voices carry along the corridor.",night:"The infirmary is quiet except for the coughs of the sick and the movement of the night attendant."},
      tavern:{dawn:"The room is cold. Someone is sweeping last night's rushes from the floor.",morning:"The kitchen is warming, and a few travellers are eating before taking the road.",midday:"The benches are half full. The talk is mostly about prices, weather and the state of the road.",afternoon:"A handful of regulars linger by the fire while Rowan keeps an eye on the door.",evening:"The room grows louder as workers come in for a hot meal and news.",night:"The fire is low. Rowan is turning away late drinkers and preparing to bar the door."},
      abbey:{dawn:"A bell sounds from the chapel. The brothers are beginning their morning duties.",morning:"Footsteps cross the cloister. The day's copying, cleaning and carrying have begun.",midday:"The abbey grows quieter for the meal and prayers.",afternoon:"A few visitors wait near the outer door while the brothers finish their work.",evening:"The last duties are being finished before the doors are closed.",night:"The abbey is quiet. The watch at the gate is the only movement in the yard."},
      gate:{dawn:"The road is damp and nearly empty. The first carts have not yet reached the gate.",morning:"Farm carts and travellers are arriving in small groups; the serjeant is checking their business.",midday:"The road is busier. A cart waits while its load is inspected.",afternoon:"Dust and mud settle around the gate as the traffic begins to slow.",evening:"The serjeant is warning travellers not to linger outside the walls after dusk.",night:"The gate is shut. A watchman listens for movement on the road."},
      keep:{dawn:"Servants are carrying water through the courtyard before the household is fully awake.",morning:"The steward's clerks are at their tables and petitioners wait to be heard.",midday:"The household has stopped for its meal; the corridors are quieter.",afternoon:"Reports and requests are being brought to the steward's office.",evening:"The household is finishing its business for the day; visitors are seldom received now.",night:"The keep is quiet except for the guards changing watch."}
    };
    return ambience[id]?.[part]||"The village continues its ordinary work around you.";
  }
  function localContextFor(id){
    const routine=routineFor(id),weather=weatherForToday();
    return {time:timeLabel(),dayPart:dayPart(),weather:weather.label,weatherDetail:weather.detail,place:places[state.location].name,localScene:ambientForPlace(state.location),activity:routine.activity,relationship:relationshipFor(id).title,meetings:ps(id).meetings||0,daysSinceLastMeeting:Math.max(0,state.day-(ps(id).previousMetDay||state.day)),lastMetPlace:ps(id).lastMetPlace||""};
  }
  function activeAt(id){
    const routine=routineFor(id);
    return routine.available&&routine.place===state.location;
  }
  function presentPeople(){return Object.values(people).filter(p=>activeAt(p.id));}
  function buildSceneSvg(scene){
    const palettes={market:["#6b705b","#b29b70"],infirmary:["#75806a","#ab946b"],tavern:["#5a4834","#a77d49"],abbey:["#72776c","#b3a58a"],gate:["#6c7864","#a88d5f"],keep:["#616a66","#b49b6e"]};
    const [ground,roof]=palettes[scene]||palettes.market;
    const label={market:"MARKET CROSS",infirmary:"ST BRIGID'S INFIRMARY",tavern:"THE FOX & LANTERN",abbey:"THE ABBEY",gate:"THE NORTH GATE",keep:"ASHENFORD KEEP"}[scene];
    const hour=Math.floor(state.minute/60),night=hour<5||hour>=21,dusk=hour>=18&&hour<21,dawn=hour>=5&&hour<7;
    const lighting=night?{tint:"#172033",opacity:.42}:dusk?{tint:"#82583d",opacity:.28}:dawn?{tint:"#8ca1aa",opacity:.16}:{tint:"#fff0d0",opacity:.035};
    const weather=weatherForToday().label;
    const weatherLayer=weather==="Steady rain"?'<g stroke="#d6ddd5" stroke-width="2" opacity=".24"><path d="M80 20L48 92M190 45L158 117M310 5L278 77M430 34L398 106M550 12L518 84M670 43L638 115M790 8L758 80M910 35L878 107M1030 14L998 86M1140 43L1108 115M140 210L108 282M360 190L328 262M580 210L548 282M800 190L768 262M1020 205L988 277"/></g>':weather==="Cold drizzle"?'<g stroke="#e0dfd2" stroke-width="1.5" opacity=".16"><path d="M120 60L100 104M340 30L320 74M560 52L540 96M780 28L760 72M1000 58L980 102M220 220L200 264M660 210L640 254M1080 225L1060 269"/></g>':weather==="Low mist"?'<g fill="#e2e0d2" opacity=".11"><path d="M0 270Q180 240 360 270T720 270T1200 260V320H0Z"/><path d="M0 335Q210 305 420 335T840 330T1200 325V365H0Z"/></g>':'';
    return `<svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#9b9c8d"/><stop offset=".58" stop-color="#c0b49a"/><stop offset="1" stop-color="#706a55"/></linearGradient><linearGradient id="stone" x2="0" y2="1"><stop stop-color="#b7aa8d"/><stop offset="1" stop-color="#655a46"/></linearGradient><linearGradient id="road" x2="0" y2="1"><stop stop-color="#847a63"/><stop offset="1" stop-color="#443c2e"/></linearGradient></defs>
      <rect width="1200" height="500" fill="url(#sky)"/><rect width="1200" height="500" fill="${lighting.tint}" opacity="${lighting.opacity}"/>${weatherLayer}<path d="M0 205 Q180 115 340 205T690 192T1200 180V330H0Z" fill="#747b69"/><path d="M0 250L120 165 238 250V405H0Z" fill="#514838"/><path d="M-15 240L120 120 255 240Z" fill="${roof}" stroke="#3d3428" stroke-width="10"/><path d="M960 250L1065 150 1190 250V410H960Z" fill="#514637"/><path d="M940 248L1068 118 1210 248Z" fill="${roof}" stroke="#3d3428" stroke-width="10"/><g fill="#d1c5a7" stroke="#574c3b" stroke-width="8"><rect x="65" y="260" width="115" height="142"/><rect x="1014" y="267" width="125" height="138"/></g><g fill="#4a3e2e"><rect x="95" y="290" width="25" height="42"/><rect x="143" y="290" width="25" height="42"/><rect x="1040" y="295" width="28" height="45"/><rect x="1086" y="295" width="28" height="45"/></g>
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
    const p=places[state.location],weather=weatherForToday();
    $("#scene-title").textContent=p.name;$("#scene-description").textContent=p.desc+" "+ambientForPlace(state.location)+" "+weather.detail;$("#scene-eyebrow").textContent=p.eyebrow;$("#scene-caption").textContent=p.name.toUpperCase()+" · ASHENFORD";$("#scene-weather").textContent=weather.label.toUpperCase();$("#scene-art").innerHTML=buildSceneSvg(p.scene);
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
    $("#inhabitants-list").innerHTML=present.map(p=>{const routine=routineFor(p.id);return `<button class="inhabitant-card" data-person="${p.id}"><span class="mini-portrait">${p.icon}</span><span class="inhabitant-copy"><strong>${p.name}</strong><small>${p.role} · ${escapeHtml(routine.activity)}</small></span><span class="presence-dot"></span></button>`;}).join("")||'<p class="speech-hint">No one is nearby.</p>';
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
    $("#clock-label").textContent="Day "+roman(state.day)+" · "+timeLabel();$("#header-date").textContent="THE YEAR OF OUR LORD 1348";$("#weather-label").textContent=weatherForToday().label;$("#role-label").textContent=state.roleName;$("#rep-value").textContent=state.reputation;$("#chapter-label").textContent="Chapter I · "+state.chapter;$("#standing-title").textContent=state.reputation;$("#standing-desc").textContent=state.reputation==="Unknown"?"No one knows your name.":"Your name is beginning to travel.";
    renderScene();renderPlaces();renderPeople();renderEvents();
    const q=activeQuest();$("#active-quest-card").innerHTML=`<div class="quest-kicker">${q.meta}</div><div class="quest-name">${q.name}</div><div class="quest-summary">${q.desc}</div><div class="quest-progress"><span style="width:${q.progress}%"></span></div><div class="quest-meta">${q.progress}% · JOURNEY RECORDED</div>`;
    $("#journal-count").textContent=Object.values(state.quests).filter(v=>v>=0).length;$("#inventory-count").textContent=state.inventory.length;const councilCount=$("#council-count");if(councilCount)councilCount.textContent=String(state.politics.grievances.length+state.politics.signatures.length);
    if(state.started&&$("#start-overlay")){$("#start-overlay").classList.add("hidden");}
  }
  function travelDuration(from,to){
    const routes={
      market:{infirmary:10,tavern:8,abbey:18,gate:16,keep:28},
      infirmary:{market:10,tavern:13,abbey:17,gate:24,keep:30},
      tavern:{market:8,infirmary:13,abbey:22,gate:20,keep:30},
      abbey:{market:18,infirmary:17,tavern:22,gate:25,keep:19},
      gate:{market:16,infirmary:24,tavern:20,abbey:25,keep:32},
      keep:{market:28,infirmary:30,tavern:30,abbey:19,gate:32}
    };
    return routes[from]?.[to]||15;
  }
  function travel(id){
    if(id==="keep"&&!state.flags.keepUnlocked&&state.role!=="courier"){toast("The keep's guards bar strangers from the courtyard. Speak with Serjeant Hobb.");return;}
    if(id==="keep"&&!state.flags.keepUnlocked&&state.role==="courier")state.flags.keepUnlocked=true;
    if(state.location===id)return;
    const from=state.location,minutes=travelDuration(from,id);
    state.location=id;changeTime(minutes);
    addTimeline("You walked from "+places[from].name+" to "+places[id].name+" ("+minutes+" minutes).");
    addEvent("You arrive at "+places[id].name+". "+ambientForPlace(id));
    render();save();toast("You reached "+places[id].name+" after about "+minutes+" minutes on foot.");
  }
  function openDialogue(id){
    activePerson=id;const p=people[id],s=ps(id),firstMeeting=!s.met,previousMetDay=s.lastMetDay||0;
    s.met=true;s.meetings=(s.meetings||0)+1;s.previousMetDay=previousMetDay;s.lastMetDay=state.day;s.lastMetMinute=state.minute;s.lastMetPlace=state.location;
    if(firstMeeting)remember(id,"You first met at "+places[state.location].short+" on day "+state.day+".");
    else if(previousMetDay>0&&state.day>previousMetDay+2)remember(id,"Several days passed before you met again.");
    $("#dialogue-role").textContent=p.role.toUpperCase();$("#dialogue-name").textContent=p.name;const regard=relationshipFor(id);$("#dialogue-status").textContent=regard.summary;$("#character-profile").innerHTML=`<div class="portrait-large">${p.icon}</div><div class="profile-name">${p.name}</div><div class="profile-role">${p.role}</div><p class="profile-lore">${p.lore}</p><div class="profile-connections"><strong>KNOWN CONNECTIONS</strong><span>${p.connections}</span></div><div class="npc-regard-card"><span class="npc-regard-kicker">THEIR REGARD</span><strong class="npc-regard-title">${regard.title}</strong><small class="npc-regard-copy">${regard.summary}</small></div>`;
    const log=state.dialogueLog[id]||[];
    if(!log.length)log.push({who:p.name,text:normalizeNpcSpeech(p.greeting)});
    state.dialogueLog[id]=log;renderDialogue();$("#dialogue-overlay").classList.remove("hidden");renderPeople();save();
  }
  const emotionColors={fear:"#a84f45",concern:"#c79742",anger:"#c56d3c",trust:"#66835d",curiosity:"#6488a9"};
  function renderDialogue(){
    const s=ps(activePerson),p=people[activePerson],em=s.emotions,regard=relationshipFor(activePerson);
    $("#dialogue-status").textContent=regard.summary;
    const regardTitle=$("#character-profile .npc-regard-title"),regardCopy=$("#character-profile .npc-regard-copy"),regardMeter=$("#character-profile .npc-regard-meter span");
    if(regardTitle)regardTitle.textContent=regard.title;if(regardCopy)regardCopy.textContent=regard.summary;if(regardMeter)regardMeter.style.width=regard.trust+"%";
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
  function normalizeNpcSpeech(value){
    return String(value||"")
      .replace(/\bwhat dost thou\b/gi,"what do you").replace(/\bdost thou\b/gi,"do you").replace(/\bart thou\b/gi,"are you").replace(/\bhast thou\b/gi,"have you")
      .replace(/\bthou hast\b/gi,"you have").replace(/\bthou art\b/gi,"you are").replace(/\bthou wouldst\b/gi,"you would").replace(/\bthou wilt\b/gi,"you will").replace(/\bthou shalt\b/gi,"you shall")
      .replace(/\bthou standest\b/gi,"you stand").replace(/\bthou speakest\b/gi,"you speak").replace(/\bthou bringest\b/gi,"you bring")
      .replace(/\bthou\b/gi,"you").replace(/\bthee\b/gi,"you").replace(/\bthy\b/gi,"your").replace(/\bthine\b/gi,"yours")
      .replace(/\bdost\b/gi,"do").replace(/\bdoth\b/gi,"does").replace(/\bhast\b/gi,"have").replace(/\bhath\b/gi,"has").replace(/\bart\b/gi,"are").replace(/\bwouldst\b/gi,"would").replace(/\bwilt\b/gi,"will");
  }
  function say(text,who){
    const speaker=who||people[activePerson].name;
    const clean=speaker==="You"?String(text):normalizeNpcSpeech(text);
    const log=state.dialogueLog[activePerson]||[];log.push({who:speaker,text:clean});state.dialogueLog[activePerson]=log.slice(-18);renderDialogue();save();
  }
  function closeDialogue(){if(activeRequestController)activeRequestController.abort();activeRequestController=null;if(pendingDialogueLine&&activePerson){const log=state.dialogueLog[activePerson]||[];const i=log.indexOf(pendingDialogueLine);if(i>=0)log.splice(i,1);}pendingDialogueLine=null;const input=$("#speech-input"),send=$("#speech-form button");if(input)input.disabled=false;if(send)send.disabled=false;$("#dialogue-overlay").classList.add("hidden");activePerson=null;render();}
  function completeBell(outcome){
    state.quests.bell=4;state.flags.ending=outcome;state.chapter="The Bell at Dusk";state.reputation=outcome==="protect"?"A Keeper of Secrets":outcome==="expose"?"Truth-Teller":"Voice of the Village";state.flags.keepUnlocked=true;
    if(outcome==="protect"){adjust("anselm",{trust:12,fear:-12});adjust("edmund",{trust:8,concern:-5});addEvent("A quiet kindness has been shown to Brother Anselm.");}
    if(outcome==="expose"){adjust("anselm",{fear:20,trust:-14,anger:8});adjust("hobb",{trust:4});addEvent("Word spreads that the abbey bell mystery has been exposed.");}
    if(outcome==="hearing"){adjust("anselm",{fear:-6,trust:6});adjust("margaret",{trust:4});addEvent("The village has been called to hear the truth together.");}
    addTimeline("You resolved The Bell at Dusk: "+({protect:"you protected Anselm",expose:"you exposed the hidden bell",hearing:"you called a village hearing"}[outcome])+".");addTimeline("The keep has opened its doors to you.");save();render();
  }
  function respondChoice(index){
    if(!activePerson)return;const id=activePerson,p=people[id],opts=optionsFor(id),o=opts[index];if(!o)return;const action=o.action;say(o.label,"You");changeTime(5);
    if(action==="protect"||action==="expose"||action==="hearing"){say(action==="protect"?"Then I shall carry this burden with thee. The bell was mine, and I rang it to guide food to the cottages beyond the mill.":"Thou wouldst have the village know? I rang the handbell to guide provisions to families kept apart from the road. I meant no deception.","");completeBell(action);say(({protect:"Thou hast shown mercy. I shall remember it, traveller.",expose:"So the truth is out. May the village judge me fairly.",hearing:"Then let them hear it from my own lips. I am weary of hiding."})[action]);renderDialogue();return;}
    if(action==="bell"){
      if(id==="edmund"){say("The abbey swears its clapper was removed. Yet a bell rang after midnight. I heard it from the infirmary window.");adjust(id,{curiosity:8,concern:6});if(state.quests.bell===0){state.quests.bell=1;addTimeline("Edmund asked you to learn who rang the bell.");}}
      else if(id==="rowan"){say("A cloaked figure crossed the yard after the second watch. I heard a small handbell, not the abbey bell.");adjust(id,{trust:1,curiosity:2});if(state.quests.bell===1){state.quests.bell=2;addTimeline("Rowan remembers a cloaked figure near the abbey.");}}
      else if(id==="margaret"){say("A length of hemp cord was bought here days ago. The buyer wore a novice's brown habit, though I saw no face.");adjust(id,{curiosity:8});if(state.quests.bell===2){state.quests.bell=3;addTimeline("Margaret recalls a novice buying hemp cord.");}}
      else {say("There are many tales of bells in Ashenford. Ask Edmund, Rowan, and Margaret, and compare their accounts.");}
    } else if(action==="ledger"){
      if(state.quests.ledger<0){state.quests.ledger=0;say("My ledger is in poor order. If thou canst bring rosemary and clean linen, I shall owe thee a favour.");addTimeline("Edmund entrusted you with a small errand for the infirmary.");}
      else if(state.flags.herbs&&state.flags.linen){state.quests.ledger=2;say("Rosemary and linen. Well gathered. Thou hast my thanks, and a little trust besides.");state.inventory=state.inventory.filter(x=>!["rosemary","linen"].includes(x.id));adjust("edmund",{trust:8,concern:-4});addTimeline("You completed A Physician's Ledger.");addEvent("Edmund has praised a traveller's help at the infirmary.");}
      else say("I still require rosemary and clean linen. Search the market stalls.");
    } else if(action==="parcel"){
      if(id==="margaret"){if(state.quests.parcel<0){state.quests.parcel=0;state.inventory.push({id:"sealed-parcel",name:"Margaret's sealed parcel",icon:"📦",desc:"A small parcel tied with twine, addressed to Rowan."});say("Take this parcel to Rowan at the Fox & Lantern. Do not open it; the contents are none of thy concern.");addTimeline("Margaret gave you a sealed parcel for Rowan.");}else say("Have Rowan received the parcel? I would know it safely delivered.");}
      else if(id==="rowan"&&state.quests.parcel===0){state.quests.parcel=1;state.inventory=state.inventory.filter(x=>x.id!=="sealed-parcel");say("Ah, Margaret's parcel. I shall see it safely put away. Tell her the old debt is remembered.");adjust("rowan",{trust:5});adjust("margaret",{trust:3});addTimeline("You delivered Margaret's sealed parcel to Rowan.");addEvent("A small debt between the merchant and innkeeper has been settled.");}
      else say("If Margaret has sent thee, I shall hear what she has to say.");
    } else if(action==="will"){
      if(id==="mara"){if(state.quests.will<0){state.quests.will=0;say("My cousin Will vanished on the northern road. If thou findest anything, bring it to me.");addTimeline("Mara asked you to search for her missing cousin Will.");}else if(state.flags.willFound){state.quests.will=2;say("This strap is his. I know the stitching. He was near the old mill road, then. Thank thee for bringing it.");adjust("mara",{trust:10,concern:-8});addTimeline("Mara recognised Will's broken satchel strap.");}else say("Search the roadside by the North Gate. He may have left a clue.");}
      else say("Mara has been asking after her cousin. The north road may hold an answer.");
    } else if(action==="clue"){if(state.flags.willFound){state.quests.will=2;say("I know this strap. Will carried it on the road. I must speak with Hobb.");adjust(id,{trust:8,concern:-5});}else say("Thou hast found no clue yet. Search the north road.");}
    else if(action==="tower"){say("A hidden handbell and frayed hemp cord. Someone has been using the tower stair.");}
    else if(action==="dispatch"){if(state.role==="courier"){state.flags.keepUnlocked=true;adjust(id,{trust:4});say("A royal seal? Very well. The keep shall receive thee. Proceed to Steward Alwyn.");}else say("A royal dispatch is not a token to be borrowed. What business hast thou with the crown?");}
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
    if(id==="edmund")return "I've never encountered a device like that. What does it do, exactly?";
    if(id==="margaret")return "Could it help someone buy or sell goods? That's the part I'd want to understand.";
    if(id==="rowan")return "Does it play music, or is it meant for work? Keep it away from the hearth either way.";
    if(id==="anselm")return "I don't know what to make of that. Please explain it slowly; I would rather ask than pretend I understand.";
    if(id==="mara")return "Could it help find someone on the road? If not, I have little use for it.";
    if(id==="hobb")return "I cannot allow an unknown object through the gate until I know what it is.";
    return "I have no experience with such a thing. Explain its use, and leave out the impossible claims.";
  }
  async function askNoxenStudio(text,personId){
    const p=people[personId],saved=ps(personId),hint=$("#speech-hint");
    if(activeRequestController)activeRequestController.abort();
    const controller=new AbortController();activeRequestController=controller;
    pendingDialogueLine={who:p.name,text:"Listening to your words…",pending:true};
    (state.dialogueLog[personId]||(state.dialogueLog[personId]=[])).push(pendingDialogueLine);
    if(hint)hint.textContent="NOXEN Studio · composing a reply…";
    const memory=saved.memories.slice(0,4).join("; ")||"No personal memories yet.",q=activeQuest(),profile=npcProfiles[personId]||{},context=localContextFor(personId),routine=routineFor(personId);
    const prompt=[
      "You are writing spoken dialogue for one specific person in Ashenford, a fictional English village in 1348.",
      "You are not a narrator, quest announcer, game guide or chatbot. Speak only as "+p.name+".",
      "PERSON: "+p.name+", age "+p.age+", role "+p.role+". Background: "+p.lore,
      "MANNER: "+(profile.manner||"Speak plainly and consistently with your character.")+" Current worry: "+(profile.concern||"Their own ordinary concerns.")+" Knowledge: "+(profile.knowledge||"Only what this person could reasonably know.")+" Political instincts: "+(profile.politics||"They have their own interests and do not automatically follow the crowd."),
      "RIGHT NOW: "+context.activity+". The place is "+context.place+". It is "+context.dayPart+" at "+context.time+". Weather: "+context.weather+". Surroundings: "+context.localScene,
      "PLAYER: "+state.roleName+". Social position: "+(roles[state.role]?.station||state.roleName)+". Let their position affect relevant forms of address and expectations, but do not assume their gender, personality or ability.",
      "PUBLIC AFFAIRS: "+publicPoliticalClimate()+". Treat rumour as rumour. Do not know private evidence unless this character personally learned it.",
      "RELATIONSHIP: "+context.relationship+". They have met the player "+context.meetings+" time(s); "+context.daysSinceLastMeeting+" day(s) have passed since the previous meeting. Memories: "+memory,
      "QUEST CONTEXT: "+q.name+" — "+q.desc+". Current recorded facts: bell stage "+state.quests.bell+", ledger stage "+state.quests.ledger+", parcel stage "+state.quests.parcel+", missing courier stage "+state.quests.will+". Never invent a completed task, clue, promise or event.",
      "STYLE: Use clear, natural, spoken English that is easy to understand. The setting is medieval, but do not imitate Shakespeare. Do not use 'thou', 'thee', 'thy', fake archaic grammar or constant grand speeches. A little period-appropriate vocabulary is fine when natural.",
      "REALISM: Answer the exact thing the player said. Use what you know, not what would make the plot convenient. You may be busy, distracted, uncertain, suspicious, tired, amused, impatient or unwilling to answer. Do not agree with everything. Do not become close because of one compliment. Do not repeat greetings, explain the whole quest, or end every reply with a question. Vary the length naturally, usually one to three short sentences.",
      "CONTINUITY: Use the supplied conversation history. Remember what this player has actually told you, including disagreements and promises. Do not repeat information they already know unless there is a reason. Do not narrate the player's feelings, thoughts or actions.",
      "TRUST: Ordinary small talk, praise and thanks do not earn trust by themselves. Stronger regard follows specific, remembered actions and kept promises. Return a trust change of 0 unless the player's message provides clear evidence of help, honesty, betrayal or harm. Any trust change must be between -1 and 1 for this single exchange. Other emotion changes must be between -2 and 2.",
      "MEMORY: Only return a short concrete fact, promise, clue or important personal detail that this person should remember later. Return an empty string when there is nothing worth keeping.",
      "Return ONLY JSON: {\"reply\":\"spoken line\",\"emotion_delta\":{\"fear\":0,\"concern\":0,\"anger\":0,\"trust\":0,\"curiosity\":0},\"memory\":\"\"}.",
      "Player says: "+text.slice(0,240)
    ].join("\n");
    const timeout=setTimeout(()=>controller.abort(),18000);
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
      ["fear","concern","anger","curiosity"].forEach(k=>{const n=Number(delta[k]);if(Number.isFinite(n))safeDelta[k]=Math.max(-2,Math.min(2,Math.round(n)));});
      const positiveEvidence=/\b(i brought|i returned|i delivered|i found|i kept my promise|i helped|i protected|i shared|i paid|i repaid|i apologised|i apologized|i was wrong|i did as promised)\b/i.test(text);
      const negativeEvidence=/\b(i lied|i stole|i betrayed|i threatened|i hurt|i broke my promise|i refuse to help|i won't help)\b/i.test(text);
      const proposedTrust=Number(delta.trust);
      if(Number.isFinite(proposedTrust)&&positiveEvidence)safeDelta.trust=Math.max(0,Math.min(1,Math.round(proposedTrust)));
      else if(Number.isFinite(proposedTrust)&&negativeEvidence)safeDelta.trust=Math.min(0,Math.max(-1,Math.round(proposedTrust)));
      if(typeof parsed?.memory==="string"&&parsed.memory.trim())remember(personId,parsed.memory.trim().slice(0,140));
      if(/\b(my name|i am|i'm|my family|i live|i came|i promise|i found|i brought|i saw|i heard|i delivered|i returned|i helped|i owe|i lost|i fear|i believe|i was wrong)\b/i.test(text))remember(personId,"You said: "+text.slice(0,90));
      adjust(personId,safeDelta);renderDialogue();render();save();
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
    if(/phone|smartphone|computer|laptop|internet|wifi|wi-fi|google|ai\b|robot|electric|electricity|satellite|car\b|engine|camera|app\b/.test(low)){reply=modernReply(id,t);adjust(id,{fear:1,curiosity:2});remember(id,"You spoke of an unfamiliar modern invention.");}
    else if(/bro|bruh|lol|lmao|no cap|cooked|ate|slay|rizz|fr|ngl|idk/.test(low)){reply="I don't know that expression. Could you say it another way?";adjust(id,{curiosity:1});}
    else if(/plague|sick|ill|disease|fever/.test(low)){reply=id==="edmund"?"I've seen enough fever this week. Tell me what you observed, not what someone in the street claims.":"There is sickness in the village. People are frightened, and most of what they repeat has not been checked.";adjust(id,{concern:1});}
    else if(/bell|ring|midnight|tower/.test(low)){reply=id==="anselm"?"I have already told you what I can. The stair is not open to visitors.":id==="edmund"?"I heard it from the infirmary, shortly after midnight. I did not see who rang it.":"I heard talk of a bell, but I cannot tell you more than what I witnessed.";if(state.quests.bell===0){state.quests.bell=1;addTimeline("You began investigating the strange bell.");}}
    else if(/thank|thanks/.test(low)){reply=id==="margaret"?"You're welcome. Now, was there something else?":id==="rowan"?"No trouble. Mind the step by the door.":"You're welcome."; }
    else if(/sorry|apolog/.test(low)){reply="All right. I'd rather settle the matter and get on with the work.";adjust(id,{anger:-2});}
    else if(/who are you|your name|what is your name/.test(low)){reply="I am "+p.name+", "+p.role.toLowerCase()+". My place in Ashenford is known to those who have reason to seek me.";}
    else if(/help|quest|task|job|work/.test(low)){reply="There is always work for an honest pair of hands. Speak with the folk of the market, the infirmary, and the tavern; each has a burden to share.";adjust(id,{curiosity:4});}
    else if(/king|queen|royal|castle|keep/.test(low)){reply="The keep overlooks us all. King Aldric expects loyalty, while Steward Alwyn expects his accounts to be exact.";}
    else {reply=id==="margaret"?"I'm listening. Be specific; there's work to do here.":id==="rowan"?"Go on. I'm here, though I may have to see to the kitchen in a moment.":id==="mara"?"What is it? I can't stand here all morning.":id==="edmund"?"Tell me what happened, in order. Leave out the guesses.":id==="anselm"?"I'm not sure I follow. Could you explain what you mean?":id==="hobb"?"I need a clear answer, not a long story.":id==="alwyn"?"Please get to the point. I have accounts to finish.":"I hear you. What matters most is what can be proved.";}
    say(reply);if(/\b(i promise|i found|i brought|i saw|i heard|i delivered|i returned|i helped|my name|my family)\b/i.test(t))remember(id,"You said: "+t.slice(0,90));renderDialogue();render();save();
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
      {name:"The Missing Courier",desc:"Help Mara find her cousin Will, last seen on the northern road.",status:state.quests.will===2?"Clue found":state.quests.will>=0?"In progress":"Undiscovered",objective:state.quests.will===2?"Mara recognised the satchel strap.":"Ask Mara and search the roadside at the gate."},
      {name:"The Weight of the Crown",desc:"Hear the village's complaints, collect records and signatures, request an audience and decide whether the crown should reform, share power or step aside.",status:state.politics.outcome?"Resolved":state.politics.inquiryOpened?"Royal inquiry":state.politics.grievances.length?"In progress":"Undiscovered",objective:state.politics.outcome?state.politics.outcome:state.politics.inquiryOpened?"Examine the second account book and confront the king.":"Listen to residents and build a credible petition."}
    ];
    openModal("Journal & quests",entries.map(q=>`<article class="journal-quest"><div class="quest-kicker">${q.status.toUpperCase()}</div><h3>${q.name}</h3><p>${q.desc}</p><div class="objective">CURRENT THREAD · ${q.objective}</div></article>`).join("")+`<h3 style="font:600 22px Georgia;margin:18px 0 8px">Chronicle of events</h3>`+state.timeline.map(e=>`<div class="timeline-entry" style="margin:8px 0"><span class="timeline-pin"></span><div class="timeline-copy" style="color:#594b34"><strong>Day ${roman(e.day)} · ${e.time}</strong>${escapeHtml(e.text)}</div></div>`).join(""),"JOURNAL & CHRONICLES");
  }
  function openPeople(){
    const cards=Object.values(people).map(p=>`<div class="person-sheet"><span class="mini-portrait">${p.icon}</span><div><strong>${p.name}</strong><br/><small>${p.role} · ${ps(p.id).met?"Met":"Unmet"}</small><p>${p.lore}</p><small>Opinion: ${ps(p.id).opinion}</small></div></div>`).join("");
    openModal("People of Ashenford",`<div class="journal-grid">${cards}</div>`,"THE SETTLEMENT");
  }
  function openInventory(){openModal("Your satchel",`<div class="inventory-grid">${state.inventory.map(i=>`<div class="inventory-item"><span>${i.icon}</span><strong>${escapeHtml(i.name)}</strong><small>${escapeHtml(i.desc)}</small></div>`).join("")||"<p>Your satchel is empty.</p>"}</div>`,"BELONGINGS & FINDS");}
function politicsMetrics(){
    const p=state.politics;
    const commonSupport=clamp(18+p.grievances.length*7+p.evidence.length*5+p.signatures.length*6+(p.assemblyCalled?8:0));
    const crownSupport=clamp(78-commonSupport*.58+(p.outcome==="reform"?8:0));
    const stewardInfluence=clamp(68-p.evidence.length*11-(p.inquiryOpened?12:0)-(p.stewardRemoved?45:0));
    return {commonSupport,crownSupport,stewardInfluence};
  }
  function hasPoliticalEvidence(id){return state.politics.evidence.some(item=>item.id===id);}
  function addPoliticalGrievance(id,title,detail,source){
    const p=state.politics;if(p.grievances.some(item=>item.id===id))return false;
    p.grievances.push({id,title,detail,source,day:state.day});addTimeline("A village grievance was recorded: "+title+".");return true;
  }
  function addPoliticalEvidence(id,title,detail,source){
    const p=state.politics;if(p.evidence.some(item=>item.id===id))return false;
    p.evidence.push({id,title,detail,source,day:state.day});addTimeline("A piece of testimony was added to the village record: "+title+".");return true;
  }
  function publicPoliticalClimate(){
    const p=state.politics;
    if(p.outcome==="abdication")return "The crown has passed to a temporary council by public agreement. People are watching whether it can govern fairly.";
    if(p.outcome==="regency")return "A temporary village council now shares authority with the crown. The settlement is waiting to see whether reform will last.";
    if(p.outcome==="reform")return "The steward has been removed pending judgment, and the storehouse accounts are being opened to public review.";
    if(p.inquiryOpened)return "The king has ordered an inquiry into complaints about grain levies and the royal storehouse. Rumours are spreading, but the facts remain disputed.";
    if(p.assemblyCalled)return "The Common Petition has held a peaceful assembly. Some residents demand a council to oversee the crown; others remain loyal to Aldric or fear the uncertainty of change.";
    if(p.signatures.length>=3)return "A Common Petition is gathering names. Some residents want a public hearing and elected oversight; others fear disorder.";
    if(p.grievances.length)return "Several residents have complained about grain levies, shortages and the way the steward's household keeps accounts. These are complaints, not yet proven facts.";
    return "People grumble about prices, levies and the cost of keeping the king's household. No public petition has yet been organised.";
  }
  function signatureReason(id){
    const p=state.politics;
    if(p.signatures.includes(id))return "Already signed";
    if(id==="aldric"||id==="alwyn")return "Cannot sign this petition";
    if(!ps(id).met)return "Meet them first";
    if(!activeAt(id))return "Find them at "+places[routineFor(id).place].short;
    if(ps(id).emotions.fear>=65||ps(id).emotions.anger>=65)return "They are unwilling to support you";
    const ready={
      margaret:hasPoliticalEvidence("market-ledger"),
      rowan:hasPoliticalEvidence("tavern-witness"),
      mara:p.grievances.length>=1,
      edmund:hasPoliticalEvidence("infirmary-rations")||state.quests.ledger===2,
      anselm:state.quests.bell===4&&ps(id).emotions.trust>=24,
      hobb:p.inquiryOpened&&p.evidence.length>=3
    }[id]||false;
    return ready?"Ask for their signature":"They need a clearer reason to risk signing";
  }
  function renderCouncil(){
    const p=state.politics,m=politicsMetrics();
    const evidence=p.evidence.map(item=>`<article class="council-record"><span class="council-record-mark">✦</span><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p><small>From ${escapeHtml(item.source)} · Day ${roman(item.day)}</small></div></article>`).join("");
    const grievances=p.grievances.map(item=>`<article class="council-record grievance-record"><span class="council-record-mark">✉</span><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p><small>Raised by ${escapeHtml(item.source)} · Day ${roman(item.day)}</small></div></article>`).join("");
    const signers=Object.values(people).filter(person=>!["alwyn","aldric"].includes(person.id)).map(person=>{
      const reason=signatureReason(person.id),signed=p.signatures.includes(person.id),ready=reason==="Ask for their signature";
      return `<div class="council-signer"><div class="council-signer-icon">${person.icon}</div><div class="council-signer-copy"><strong>${person.name}</strong><small>${signed?"Name recorded":escapeHtml(reason)}</small></div><button class="council-sign-button" data-council-sign="${person.id}" ${(!ready||signed)?"disabled":""}>${signed?"Signed":ready?"Ask":"—"}</button></div>`;
    }).join("");
    const at=(id)=>state.location===routineFor(id).place&&activeAt(id);
    const action=(id,title,desc,ready,locked)=>`<button class="council-action" data-council-action="${id}" ${ready?"":"disabled"}><strong>${title}</strong><span>${desc}</span><small>${ready?"Available here":locked}</small></button>`;
    const evidenceCount=p.evidence.length,grievanceCount=p.grievances.length,signatureCount=p.signatures.length;
    const petitionReady=grievanceCount>=2&&evidenceCount>=2&&signatureCount>=3;
    const auditReady=p.inquiryOpened&&at("alwyn")&&!p.stewardRemoved&&!hasPoliticalEvidence("royal-audit");
    const kingReady=at("aldric");
    const finalReady=p.kingConfronted&&kingReady&&!p.outcome;
    const result=p.outcome==="abdication"?"Aldric has formally stepped aside. A temporary council chosen by the village and household will govern while a lawful succession is settled.":p.outcome==="regency"?"The king has accepted a temporary council with authority over stores, levies and public accounts. The crown remains, but it no longer governs alone.":p.outcome==="reform"?"Alwyn has been removed from office pending judgment. The grain accounts are public, and the crown has ordered restitution to affected households.":"";
    const status=p.outcome?"Political settlement reached":p.inquiryOpened?"Royal inquiry ordered":signatureCount>=3?"A public petition is taking shape":grievanceCount?"Grievances have been heard":"No formal complaint has reached the keep";
    $("#modal-content").innerHTML=`
      <section class="council-intro"><div class="quest-kicker">ASHENFORD · THE YEAR OF OUR LORD 1348</div><h3>The weight of the crown</h3><p>Grain is short, levies are unpopular, and the king's steward controls the storehouse accounts. Listen to residents, compare testimony, gather signatures and take a case to the keep. A rumour is not proof; the court will ask for records.</p><div class="council-status">${status}</div></section>
      <section class="council-meters"><div class="council-meter"><div><span>COMMON PETITION</span><b>${m.commonSupport}%</b></div><i><em style="width:${m.commonSupport}%"></em></i></div><div class="council-meter"><div><span>CROWN'S STANDING</span><b>${m.crownSupport}%</b></div><i><em style="width:${m.crownSupport}%"></em></i></div><div class="council-meter"><div><span>STEWARD'S INFLUENCE</span><b>${m.stewardInfluence}%</b></div><i><em style="width:${m.stewardInfluence}%"></em></i></div></section>
      ${result?`<section class="council-settlement"><span>✦ THE SETTLEMENT</span><p>${result}</p></section>`:""}
      <section class="council-section"><div class="council-section-heading"><div><span>01 · LISTEN</span><h3>Hear the complaints</h3></div><small>Speak to people where they work</small></div><div class="council-action-grid">
        ${action("market_records","Compare the market tallies","Margaret has kept her own figures for grain bought and levies paid.",state.location==="market"&&at("margaret")&&!hasPoliticalEvidence("market-ledger"),"Go to the Market Cross while Margaret is at her stall")}
        ${action("mara_grievance","Hear Mara's complaint","She says several households have received less grain than they were promised.",state.location===routineFor("mara").place&&at("mara")&&!p.grievances.some(x=>x.id==="ration-complaint"),"Find Mara at the North Gate or Market Cross")}
        ${action("rowan_witness","Ask Rowan about the carts","He may remember what was moved through the yard after the market closed.",state.location==="tavern"&&at("rowan")&&!hasPoliticalEvidence("tavern-witness"),"Visit the Fox & Lantern while Rowan is working")}
        ${action("gate_register","Review the gate register","Hobb can compare official wagon entries with what passed through the gate.",state.location==="gate"&&at("hobb")&&!hasPoliticalEvidence("gate-register"),"Visit the North Gate while Hobb is on duty")}
        ${action("infirmary_rations","Ask about infirmary supplies","Edmund can say whether the public stores have delivered what the infirmary was promised.",state.location==="infirmary"&&at("edmund")&&!hasPoliticalEvidence("infirmary-rations"),"Visit St. Brigid's while Edmund is working")}
      </div></section>
      <section class="council-section"><div class="council-section-heading"><div><span>02 · BUILD A CASE</span><h3>Petitioners and witnesses</h3></div><small>${signatureCount} of 6 names</small></div>
        <div class="council-signers">${signers}</div>
        <p class="council-note">People sign only when they have a reason to risk being seen against the steward. Meet them first, hear their concerns and bring something they can stand behind.</p>
        <div class="council-action-grid">
          ${action("ask_steward","Question Steward Alwyn","Ask him to explain the shortages and the handling of village levies.",state.location==="keep"&&at("alwyn")&&!p.inquiryOpened&&!p.stewardQuestioned,p.stewardQuestioned?"You have already heard his answer":"The steward is at the keep during office hours")}
          ${action("call_assembly","Call a village assembly","Invite residents to meet peacefully and discuss council oversight of the crown.",state.location==="market"&&at("margaret")&&grievanceCount>=2&&signatureCount>=3&&!p.assemblyCalled,"Requires two grievances and three petition signatures")}
          ${action("request_audience","Request an audience","Hobb can issue a pass once a credible petition reaches the gate.",state.location==="gate"&&at("hobb")&&grievanceCount>=2&&evidenceCount>=2&&signatureCount>=3&&!state.flags.keepUnlocked,"Bring two grievances, two pieces of testimony and three signatures to Hobb")}
          ${action("present_petition","Present the petition to King Aldric","Ask the crown to open the storehouse accounts and hear the villagers.",state.location==="keep"&&kingReady&&petitionReady&&!p.inquiryOpened,"Bring three signatures, two grievances and two pieces of testimony to the keep")}
        </div>
      </section>
      <section class="council-section"><div class="council-section-heading"><div><span>03 · THE INQUIRY</span><h3>Records of the crown</h3></div><small>${p.inquiryOpened?"Inquiry open":"Not yet ordered"}</small></div>
        <div class="council-action-grid">
          ${action("audit_records","Examine the second account book","Under the king's warrant, compare the steward's reserve ledger with the public store record.",auditReady,"The king must first order an inquiry; Alwyn must be in his office")}
          ${action("confront_king","Bring the audit to the king","Ask Aldric why his seal appears on a reserve order tied to missing relief grain.",state.location==="keep"&&kingReady&&hasPoliticalEvidence("royal-audit")&&!p.kingConfronted,"Complete the royal audit and speak with Aldric")}
        </div>
      </section>
      <section class="council-section"><div class="council-section-heading"><div><span>04 · WHAT SHOULD CHANGE?</span><h3>Decisions before the crown</h3></div><small>Peaceful political outcomes</small></div>
        <div class="council-action-grid">
          ${action("restore_order","Demand restitution and reform","Remove Alwyn from office, return the diverted grain and open the accounts to public review.",finalReady,"Bring the audit to Aldric first")}
          ${action("demand_regency","Demand a village council","A lawful regency would share authority with the crown and oversee stores, taxes and appointments.",finalReady&&signatureCount>=5&&evidenceCount>=3&&m.commonSupport>=65,"Requires five signatures, three records and broad support")}
          ${action("demand_abdication","Call for the king to step aside","Ask Aldric to abdicate by public agreement and let a temporary council govern during a lawful succession.",finalReady&&signatureCount>=6&&evidenceCount>=4&&m.commonSupport>=82,"Requires all six signatures, four records and overwhelming public support")}
        </div>
      </section>
      <section class="council-section"><div class="council-section-heading"><div><span>THE RECORD</span><h3>Complaints received</h3></div><small>${grievanceCount} recorded</small></div>${grievances||'<p class="council-empty">No complaints have been formally recorded. Start by listening to people in the village.</p>'}</section>
      <section class="council-section"><div class="council-section-heading"><div><span>THE EVIDENCE</span><h3>Testimony and documents</h3></div><small>${evidenceCount} collected</small></div>${evidence||'<p class="council-empty">No supporting testimony has been collected yet.</p>'}</section>
      <section class="council-section"><div class="council-section-heading"><div><span>PUBLIC WORD</span><h3>What people are saying</h3></div></div><p class="council-note">${escapeHtml(publicPoliticalClimate())}</p>${p.kingResponse?`<blockquote class="council-king-response">${escapeHtml(p.kingResponse)}</blockquote>`:""}</section>
    `;
  }
  function openCouncil(){openModal("Town & Crown","","VILLAGE AFFAIRS");renderCouncil();}
  function councilAction(action){
    const p=state.politics;
    const time=(minutes)=>{changeTime(minutes);render();};
    if(action==="market_records"&&state.location==="market"&&activeAt("margaret")){
      addPoliticalGrievance("grain-levy","Grain levies and short stores","Margaret's customers have paid the levy, yet the public store tally appears lower than the amount collected.","Margaret Whitmore");
      addPoliticalEvidence("market-ledger","Margaret's market tally","Her private sales and levy notes do not match the public count of grain received by the storehouse. It is a discrepancy, not proof of where the grain went.","Margaret Whitmore");
      remember("margaret","You compared her market tally with the public store count; she kept a record of the discrepancy.");
      addEvent("A discrepancy between market tallies and the storehouse account is being discussed.");time(10);
    }else if(action==="mara_grievance"&&activeAt("mara")){
      addPoliticalGrievance("ration-complaint","Reduced household rations","Mara says several working households received less grain than the steward's notice promised.","Mara Fenwick");
      remember("mara","You listened to her complaint that household grain rations were smaller than promised.");
      addEvent("Mara has spoken openly about reduced grain rations.");time(8);
    }else if(action==="rowan_witness"&&state.location==="tavern"&&activeAt("rowan")){
      addPoliticalGrievance("late-haulage","Unpaid cart work","Rowan says two carters were promised payment for moving grain, but neither has been paid in full.","Rowan Pike");
      addPoliticalEvidence("tavern-witness","Rowan's account of the late carts","Rowan recalls carts bearing the steward's mark arriving after the market closed. He heard the carters complain that their payment was short.","Rowan Pike");
      remember("rowan","You asked about the grain carts. He remembers the steward's mark and the carters' unpaid wages.");
      addEvent("Talk of late grain carts and unpaid carters has reached the tavern.");time(10);
    }else if(action==="gate_register"&&state.location==="gate"&&activeAt("hobb")){
      addPoliticalGrievance("gate-discrepancy","Unclear storehouse deliveries","The gate register records more grain wagons leaving under storehouse orders than the public account acknowledges.","Serjeant Hobb");
      addPoliticalEvidence("gate-register","The gate register","Hobb's official entries show several storehouse wagons whose destinations were entered differently from the deliveries listed in the public account.","Serjeant Hobb");
      remember("hobb","You compared the gate register with the public store entries. Hobb confirmed that several destinations were recorded inconsistently.");
      addEvent("Serjeant Hobb has confirmed discrepancies in the gate register.");time(12);
    }else if(action==="infirmary_rations"&&state.location==="infirmary"&&activeAt("edmund")){
      addPoliticalGrievance("infirmary-shortage","The infirmary's missing supplies","Edmund says the infirmary received fewer sacks and linen bundles than the crown's delivery notice promised.","Edmund Blackthorn");
      addPoliticalEvidence("infirmary-rations","Edmund's delivery notes","The infirmary's dated notes record fewer supplies delivered than the number listed on its royal allotment.","Edmund Blackthorn");
      remember("edmund","You compared his delivery notes with the royal allotment. He confirmed that fewer supplies arrived than promised.");
      addEvent("The infirmary's delivery notes have raised further questions about the royal stores.");time(10);
    }else if(action==="ask_steward"&&state.location==="keep"&&activeAt("alwyn")&&!p.inquiryOpened&&!p.stewardQuestioned){
      p.stewardQuestioned=true;p.kingResponse="Alwyn insists the reserve is accounted for and says the public figures are incomplete. He refuses to discuss private stores without a royal order.";
      remember("alwyn","You asked about the grain shortages. He said the reserve is accounted for and refused to discuss the private store without royal authority.");
      addEvent("Steward Alwyn has denied wrongdoing and asked for a royal order before showing the reserve accounts.");time(8);
    }else if(action==="call_assembly"&&state.location==="market"&&activeAt("margaret")&&p.grievances.length>=2&&p.signatures.length>=3&&!p.assemblyCalled){
      p.assemblyCalled=true;
      p.kingResponse="A public meeting has been called at the Market Cross. Residents may speak for reform, council oversight or the continuation of the crown.";
      addEvent("The Common Petition has called a peaceful village assembly. Some residents are asking whether Ashenford should be governed by a council.");addTimeline("Residents gathered at the Market Cross to debate the crown's authority and the steward's accounts.");time(20);
    }else if(action==="request_audience"&&state.location==="gate"&&activeAt("hobb")&&p.grievances.length>=2&&p.evidence.length>=2&&p.signatures.length>=3&&!state.flags.keepUnlocked){
      state.flags.keepUnlocked=true;p.audiencePass=true;
      addEvent("Serjeant Hobb has issued a formal pass for a petition to be presented at the keep.");addTimeline("Hobb granted you an audience pass after reviewing the petition's supporting names and records.");time(6);toast("Hobb has granted you access to the keep.");
    }else if(action==="present_petition"&&state.location==="keep"&&activeAt("aldric")&&p.grievances.length>=2&&p.evidence.length>=2&&p.signatures.length>=3&&!p.inquiryOpened){
      p.inquiryOpened=true;p.petitionStarted=true;p.kingResponse="Aldric has ordered the storehouse accounts examined. He warns that accusations against a royal officer must be supported by records.";
      remember("aldric","You presented a petition with testimony about the grain levies. He ordered an inquiry into the storehouse accounts.");
      addEvent("King Aldric has ordered a formal inquiry into the grain accounts.");addTimeline("The Common Petition was presented to King Aldric; a royal inquiry was ordered.");time(10);
    }else if(action==="audit_records"&&state.location==="keep"&&activeAt("alwyn")&&p.inquiryOpened&&!p.stewardRemoved&&!hasPoliticalEvidence("royal-audit")){
      addPoliticalEvidence("royal-audit","The second storehouse ledger","The audit finds that Alwyn diverted part of the relief grain into a private reserve and altered the public tally. A separate order bears the king's seal, authorising a reserve but not the false account.","Royal clerk's audit");
      addPoliticalEvidence("royal-seal","The king's reserve order","Aldric authorised a grain reserve for the keep during the shortage. The document does not show that he approved Alwyn's altered public figures.","Royal clerk's audit");
      p.kingResponse="The royal clerk found a second ledger. It records grain moved into a private reserve and figures changed before the public account was copied. The king's seal authorised a reserve, but not the altered figures.";
      remember("alwyn","The royal audit uncovered a second storehouse ledger showing grain diverted into a private reserve and an altered public tally.");
      remember("aldric","The royal audit found Alwyn altered the public store tally while a separate reserve order carried the king's seal.");
      addEvent("A royal audit has uncovered a second ledger and evidence of grain diverted by the steward.");addTimeline("The royal inquiry found evidence that Alwyn altered the storehouse account.");time(15);
    }else if(action==="confront_king"&&state.location==="keep"&&activeAt("aldric")&&hasPoliticalEvidence("royal-audit")&&!p.kingConfronted){
      p.kingConfronted=true;p.kingResponse="Aldric admits he authorised a reserve for the keep, but says he did not authorise the false tally or the private diversion. He accepts that he failed to oversee the steward properly.";
      remember("aldric","When confronted with the audit, the king admitted signing a reserve order but denied authorising Alwyn's false tally. He accepted responsibility for failing to supervise him.");
      addEvent("King Aldric has admitted authorising the reserve and accepted responsibility for failing to supervise Alwyn.");addTimeline("You confronted the king with the audit. He acknowledged his failure of oversight.");time(8);
    }else if(action==="restore_order"&&p.kingConfronted&&state.location==="keep"&&activeAt("aldric")&&!p.outcome){
      p.stewardRemoved=true;p.outcome="reform";p.kingResponse="Alwyn is removed from office pending judgment. The grain is to be returned to the public stores, the levy reviewed and the accounts read before the village.";
      state.reputation="Advocate of the Commons";state.chapter="The Open Accounts";
      adjust("margaret",{trust:4});adjust("rowan",{trust:3});adjust("mara",{trust:4});adjust("edmund",{trust:3});
      addEvent("Alwyn has been removed pending judgment. The crown orders restitution and open storehouse accounts.");addTimeline("The king accepted the petition's demand for reform and restitution.");time(5);
    }else if(action==="demand_regency"&&p.kingConfronted&&state.location==="keep"&&activeAt("aldric")&&p.signatures.length>=5&&p.evidence.length>=3&&politicsMetrics().commonSupport>=65&&!p.outcome){
      p.outcome="regency";p.stewardRemoved=true;p.kingResponse="Aldric accepts a temporary council with elected representatives from the market, abbey and household. The council will oversee grain stores, levies and appointments while the king retains the crown.";
      state.reputation="Voice of the Commons";state.chapter="The Council of Ashenford";
      addEvent("Aldric has agreed to a temporary council with authority over the stores and public accounts.");addTimeline("The Common Petition secured a peaceful council regency.");time(8);
    }else if(action==="demand_abdication"&&p.kingConfronted&&state.location==="keep"&&activeAt("aldric")&&p.signatures.length>=6&&p.evidence.length>=4&&politicsMetrics().commonSupport>=82&&!p.outcome){
      p.outcome="abdication";p.stewardRemoved=true;p.kingResponse="Aldric agrees to step aside rather than divide the village. A temporary council will administer Ashenford while the lawful succession is settled.";
      state.reputation="Architect of the Settlement";state.chapter="A Crown Laid Down";
      addEvent("King Aldric has agreed to abdicate by public agreement. A temporary council will govern during the succession.");addTimeline("The Common Petition secured a peaceful transfer of authority.");time(10);
    }else{
      toast("That action cannot be completed here, or its conditions have not yet been met.");
    }
    save();render();renderCouncil();
  }
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
    $$(".nav-item").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.view;activeTab=v;$$(".nav-item").forEach(n=>n.classList.toggle("active",n===b));if(v==="world")toast("You are exploring Ashenford.");if(v==="council")openCouncil();if(v==="journal")openJournal();if(v==="people")openPeople();if(v==="inventory")openInventory();}));
    $("#modal-content").addEventListener("click",e=>{const actionButton=e.target.closest("[data-council-action]");if(actionButton&&!actionButton.disabled){councilAction(actionButton.dataset.councilAction);return;}const signButton=e.target.closest("[data-council-sign]");if(signButton&&!signButton.disabled){const id=signButton.dataset.councilSign;if(signatureReason(id)==="Ask for their signature"){state.politics.signatures.push(id);remember(id,"You asked them to support the Common Petition; they agreed to add their name.");addTimeline(people[id].name+" signed the Common Petition.");addEvent(people[id].name+" has added a name to the petition.");changeTime(3);if(state.politics.signatures.length>=3&&!state.politics.petitionStarted){state.politics.petitionStarted=true;addEvent("The Common Petition is now being discussed openly in the village.");}save();render();renderCouncil();}}});
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