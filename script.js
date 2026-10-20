(() => {
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const ago=n=>{let d=new Date();d.setDate(d.getDate()-n);return d.toISOString()};
const initial=[
{id:"CC-1048",title:"Library Wi-Fi keeps disconnecting",category:"IT Support",date:ago(1),status:"In Progress",priority:"Normal",student:"Aarav Sharma",email:"aarav.sharma@college.edu",description:"Wi-Fi disconnects in the library."},
{id:"CC-1042",title:"Projector not working in Room 204",category:"Facilities",date:ago(3),status:"Pending",priority:"High",student:"Aarav Sharma",email:"aarav.sharma@college.edu",description:"The classroom projector does not turn on."},
{id:"CC-1036",title:"Assignment deadline clarification",category:"Academics",date:ago(6),status:"Resolved",priority:"Low",student:"Aarav Sharma",email:"aarav.sharma@college.edu",description:"Need clarification about assignment deadline."}
];
let items=(()=>{try{return JSON.parse(localStorage.getItem("cc_items"))||initial}catch{return initial}})();
let notices=(()=>{try{return JSON.parse(localStorage.getItem("cc_notices"))||[]}catch{return []}})();
const save=()=>{try{localStorage.setItem("cc_items",JSON.stringify(items));localStorage.setItem("cc_notices",JSON.stringify(notices))}catch{}};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const date=s=>new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(s));
const catIcon=c=>({"IT Support":"⌘","Facilities":"⌂","Academics":"▣","Fees & Finance":"₹","Hostel":"⌂","Other":"✧"}[c]||"✧");
const status=s=>`<span class="status ${s.replace(" ","-")}">${esc(s)}</span>`;
const priority=s=>`<span class="priority ${esc(s)}">${esc(s)}</span>`;
const request=c=>`<span class="request-title">${esc(c.title)}</span><span class="request-id">${esc(c.id)}</span>`;
const category=c=>`<span class="category"><span class="cat-icon">${catIcon(c)}</span>${esc(c)}</span>`;
function toast(msg,type="success"){let el=document.createElement("div");el.className="toast "+type;el.textContent=msg;$("#toastArea").append(el);setTimeout(()=>el.remove(),3500)}
function addNotice(msg){notices.unshift({message:msg,date:new Date().toISOString()});notices=notices.slice(0,10);save()}
function render(){
let total=items.length,res=items.filter(x=>x.status==="Resolved").length,open=total-res,high=items.filter(x=>x.priority==="High"&&x.status!=="Resolved").length;
$("#total").textContent=String(total).padStart(2,"0");$("#pending").textContent=String(open).padStart(2,"0");$("#resolved").textContent=String(res).padStart(2,"0");$("#navCount").textContent=total;
$("#adminTotal").textContent=String(total).padStart(2,"0");$("#adminPending").textContent=String(open).padStart(2,"0");$("#adminResolved").textContent=String(res).padStart(2,"0");$("#adminHigh").textContent=String(high).padStart(2,"0");
let recent=[...items].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);
$("#recent").innerHTML=recent.map(c=>`<tr><td>${request(c)}</td><td>${category(c.category)}</td><td>${date(c.date)}</td><td>${status(c.status)}</td></tr>`).join("");
renderRequests();renderAdmin()
}
function renderRequests(){
let q=($("#search")?.value||"").toLowerCase(),st=$("#statusFilter")?.value||"all",cat=$("#categoryFilter")?.value||"all";
let list=[...items].sort((a,b)=>new Date(b.date)-new Date(a.date)).filter(c=>(st==="all"||c.status===st)&&(cat==="all"||c.category===cat)&&`${c.title} ${c.id} ${c.category} ${c.description}`.toLowerCase().includes(q));
$("#requestCount").textContent=`Showing ${list.length} of ${items.length} requests`;
$("#allRows").innerHTML=list.map(c=>`<tr><td>${request(c)}</td><td>${category(c.category)}</td><td>${date(c.date)}</td><td>${status(c.status)}</td><td>${priority(c.priority)}</td></tr>`).join("");$("#empty").hidden=list.length>0
}
function renderAdmin(){
let q=($("#adminSearch")?.value||"").toLowerCase();
let list=[...items].sort((a,b)=>new Date(b.date)-new Date(a.date)).filter(c=>`${c.title} ${c.id} ${c.category} ${c.student}`.toLowerCase().includes(q));
$("#adminRows").innerHTML=list.map(c=>`<tr><td>${request(c)}<span class="request-id">${esc(c.student||"Student")}</span></td><td>${category(c.category)}</td><td>${date(c.date)}</td><td>${priority(c.priority)}</td><td>${status(c.status)}</td><td><select class="admin-select" data-id="${c.id}" aria-label="Update ${c.id}"><option ${c.status==="Pending"?"selected":""}>Pending</option><option ${c.status==="In Progress"?"selected":""}>In Progress</option><option ${c.status==="Resolved"?"selected":""}>Resolved</option></select></td></tr>`).join("")
}
const pages={overview:"Overview",requests:"My complaints",new:"New request",assistant:"AI assistant",admin:"Admin dashboard"};
function go(p){let el=$("#page-"+p);if(!el)return;$$(".page").forEach(x=>x.classList.toggle("active",x===el));$$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===p));$("#crumb").textContent=pages[p];$("#sidebar").classList.remove("open");if(p==="requests")renderRequests();if(p==="admin")renderAdmin();window.scrollTo({top:0,behavior:"smooth"})}
document.addEventListener("click",e=>{let p=e.target.closest("[data-page]");if(p){e.preventDefault();go(p.dataset.page)}let q=e.target.closest("[data-question]");if(q){go("assistant");send(q.dataset.question)}});
$("#menu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#notifications").addEventListener("click",()=>toast(notices.length?notices[0].message:"You're all caught up — no new notifications."));
["search","statusFilter","categoryFilter"].forEach(id=>$("#"+id).addEventListener(id==="search"?"input":"change",renderRequests));$("#adminSearch").addEventListener("input",renderAdmin);
$("#adminRows").addEventListener("change",e=>{let s=e.target.closest("[data-id]");if(!s)return;let c=items.find(x=>x.id===s.dataset.id);if(!c)return;let old=c.status;c.status=s.value;save();addNotice(`Request ${c.id} status changed from ${old} to ${c.status}.`);render();toast(`${c.id} updated to ${c.status}. Notification added.`)});
const rules={"IT Support":["wifi","wi-fi","internet","login","password","computer","laptop","software","email","network","printer","portal","website","technical","account","app","system"],"Facilities":["classroom","projector","fan","light","bench","desk","chair","building","clean","washroom","toilet","water","electricity","maintenance","repair","air conditioning"],"Academics":["assignment","exam","marks","grade","result","attendance","timetable","lecture","professor","teacher","course","syllabus","certificate","class","subject"],"Fees & Finance":["fee","fees","payment","scholarship","refund","receipt","finance","invoice","tuition","fine","transaction"],"Hostel":["hostel","roommate","warden","dorm","mess","food","accommodation","bed"]};
function suggest(text){let best="Other",score=0;for(let [cat,words] of Object.entries(rules)){let n=words.filter(w=>text.toLowerCase().includes(w)).length;if(n>score){best=cat;score=n}}return best}
function updateSuggest(){let text=$("#title").value+" "+$("#description").value;if(!text.trim()){$("#suggestion").textContent="Waiting";$("#suggestionText").textContent="Start typing to get a suggested category.";return}let c=suggest(text);$("#suggestion").textContent=c;$("#suggestionText").textContent="Suggested from keywords. You can still choose another category.";let sel=$("#category");if(!sel.value||sel.dataset.auto==="true"){sel.value=c;sel.dataset.auto="true"}}
$("#title").addEventListener("input",updateSuggest);$("#description").addEventListener("input",updateSuggest);$("#category").addEventListener("change",()=>$("#category").dataset.auto="false");$("#clear").addEventListener("click",()=>setTimeout(()=>{$("#category").dataset.auto="false";updateSuggest()},0));
let ticket="";
$("#requestForm").addEventListener("submit",e=>{e.preventDefault();let title=$("#title").value.trim(),email=$("#email").value.trim(),description=$("#description").value.trim();if(!title||!email||!description){toast("Please complete required fields.","error");return}let cat=$("#category").value||suggest(title+" "+description);let num=Math.max(1050,...items.map(x=>Number(x.id.split("-")[1])||0))+1;let c={id:"CC-"+num,title,category:cat,date:new Date().toISOString(),status:"Pending",priority:$("#priority").value,student:"Aarav Sharma",email,description};items.push(c);save();addNotice(`Your request ${c.id} was submitted successfully.`);ticket=c.id;$("#ticketId").textContent=ticket;$("#modalText").textContent=`“${title}” has been saved in this browser demo.`;$("#modal").hidden=false;$("#requestForm").reset();$("#category").dataset.auto="false";updateSuggest();render()});
$("#closeModal").addEventListener("click",()=>$("#modal").hidden=true);$("#modal").addEventListener("click",e=>{if(e.target===$("#modal"))$("#modal").hidden=true});$("#viewRequests").addEventListener("click",()=>{$("#modal").hidden=true;go("requests")});$("#copyId").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(ticket);toast("Request ID copied")}catch{toast("Your request ID is "+ticket)}});
// Rule-based demo chatbot. Replace with a secure backend/API for real generative AI.
const faq=[
{keys:["what can","features","website do","about this website","what is campuscare","purpose"],a:"CampusCare is an AI-powered college help desk prototype. Students can submit complaints, track status, see pending and resolved counts, and ask common questions. Staff can use the demo admin dashboard to update statuses. This version stores data only in this browser."},
{keys:["submit","raise","new complaint","create a request","file a complaint","complaint"],a:"To submit a request, open “New request”. Enter a title, college email, and clear description. Choose a category and priority, then submit. You’ll receive a unique request ID such as CC-1051. The keyword-based category suggestion can help choose a category."},
{keys:["track","status","where is my","check my request","request id"],a:()=>`Open “My complaints” to see your requests and their status. Pending means waiting for review; In Progress means being handled; Resolved means marked complete. There are ${items.length} demo requests saved in this browser.`},
{keys:["pending","in progress","resolved","status mean"],a:"Pending means the team has not started handling it. In Progress means it is being worked on. Resolved means it has been marked complete. In this demo, staff can update status from Admin dashboard."},
{keys:["admin","dashboard","staff","manage complaint"],a:"Open “Admin dashboard” to search requests, view categories and priority, and change request status. A status change creates a demo notification. This prototype has no secure staff login; production needs server-side roles and access control."},
{keys:["notification","notify","alert","status change"],a:"This demo creates a local notification when a request is submitted or its status changes in the Admin dashboard. Real email, SMS, or push notifications need a backend service."},
{keys:["category","categorize","ai categor","automatic"],a:"The form uses keyword-based category suggestions for IT Support, Facilities, Academics, Fees & Finance, Hostel, or Other. This demonstrates AI-assisted routing but is not a trained AI model. A real classifier could use a secure server-side model/API."},
{keys:["ai","artificial intelligence","chatbot","how do you work"],a:"I’m the built-in CampusCare demo assistant. I match your question against common topics and return a helpful answer. I don’t call an external AI model in this version. For generative AI, connect a secure backend to an AI API and keep the API key on the server—not in browser JavaScript."},
{keys:["login","register","registration","sign up","account"],a:"This front-end prototype uses a sample student profile instead of real registration/login. A production system needs secure authentication, password hashing, verified email, sessions, and role-based access. Never store passwords in localStorage."},
{keys:["data saved","localstorage","database","server","privacy","secure"],a:"Data is stored in this browser’s localStorage and is not shared across devices or users. Clearing browser storage may remove it. A real system needs a database, secure API, authentication, access control, backups, and privacy controls. Do not enter confidential student data here."},
{keys:["contact","human","urgent","support team","email"],a:"For urgent or account-specific issues, contact your college’s official IT desk, student affairs office, or department administrator. This demo does not send real tickets to staff."},
{keys:["mobile","phone","responsive"],a:"Yes, the interface is responsive. On smaller screens the sidebar becomes a menu and the dashboard, form, and assistant adapt to mobile screens."},
{keys:["hello","hi","hey","good morning","good afternoon","good evening"],a:"Hi! 👋 Welcome to CampusCare. Ask me about submitting a request, tracking status, notifications, the admin dashboard, or how this website works."},
{keys:["thank","thanks"],a:"You’re welcome! 😊 Ask me if you need anything else about CampusCare."}
];
function answer(q){let text=q.toLowerCase(),best=null,score=0;for(let f of faq){let n=f.keys.reduce((sum,k)=>sum+(text.includes(k)?(k.includes(" ")?2:1):0),0);if(n>score){best=f;score=n}}if(best)return typeof best.a==="function"?best.a():best.a;return "I can help with CampusCare’s features, submitting a request, tracking complaint status, categories, notifications, and the demo admin dashboard. Could you rephrase your question or ask about one of those topics? For real college account issues, contact your official support team."}
function addMessage(text,who){let row=document.createElement("div");row.className="message "+who;let icon=document.createElement("span");icon.className="message-avatar";icon.textContent=who==="bot"?"✦":"AS";let wrap=document.createElement("div"),name=document.createElement("b");name.textContent=who==="bot"?"CampusCare AI":"You";let p=document.createElement("p");p.textContent=text;wrap.append(name,p);row.append(icon,wrap);$("#messages").append(row);$("#messages").scrollTop=$("#messages").scrollHeight}
function send(text){text=String(text||"").trim();if(!text)return;addMessage(text,"user");$("#chatInput").value="";setTimeout(()=>addMessage(answer(text),"bot"),180)}
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();send($("#chatInput").value)});$("#resetChat").addEventListener("click",()=>{$("#messages").innerHTML="";addMessage("Hi there! 👋 I’m the CampusCare assistant. Ask me how this website works, how to submit or track a request, or about common campus support questions.","bot")});
render();
})();