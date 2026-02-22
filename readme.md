# ⚡ God Stack Framework

Arsitektur SPA (Single Page Application) minimalis berbasis JavaScript murni dan Supabase. Satu file untuk segalanya. Tanpa build tools, tanpa ribet.

---

## 🚀 Memulai (Get Started)
Salin source code utama dari tautan di bawah ini ke dalam file `index.html` Anda untuk mulai menggunakan library ini:
[Ambil Source Code framework.html](https://raw.githubusercontent.com/nursyah21/godstack/refs/heads/main/framework.html)

---

## 📖 Dokumentasi Fitur

### 1. Manipulasi DOM & Event ($)
Gunakan selector `$` untuk menangkap elemen dan memanipulasi atribut, style, atau event.

```javascript
// Menangkap elemen & ubah isi HTML
$('#app').html('Hello World');

// Menambah Class (Contoh manual via attr/style)
$('#app').css({ color: 'blue', fontWeight: 'bold' });

// Mengatur atau mengambil Atribut
$('input').attr('placeholder', 'Masukkan nama...');
const type = $('input').attr('type');

// Event Listener
$('#btn').on('click', () => alert('Diklik!'));

```

### 2. Client-Side Routing ($.route)

Navigasi halaman menggunakan hash URL (`#`) tanpa reload.

```javascript
$.route({
    '/': () => $('#app').html('<h1>Beranda</h1>'),
    'login': () => renderLoginPage(),
    'data': () => renderDataPage(),
    '404': () => $('#app').html('<h1>Not Found</h1>')
});

```

### 3. Database Supabase (SQL & RLS)

Jalankan query ini di SQL Editor Supabase untuk mengatur tabel dan keamanan:

```sql
-- 1. Buat Tabel
CREATE TABLE items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_item TEXT NOT NULL,
  user_id uuid REFERENCES auth.users DEFAULT auth.uid()
);

-- 2. Aktifkan Keamanan (RLS)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Akses (Policy)
CREATE POLICY "Public View" ON items FOR SELECT USING (true);
CREATE POLICY "Owner Insert" ON items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Owner All" ON items FOR ALL USING (auth.uid() = user_id);

```

### 4. Login & Ajax (serialize)

Gunakan `serialize()` untuk memproses form secara otomatis dan kirim via `$.ajax`.

```javascript
// Contoh Login ke Supabase
$('#loginForm').on('submit', (e) => {
    e.preventDefault();
    const payload = $('#loginForm').serialize(); // Menjadi object {email, password}
    
    $.ajax({
        url: '[https://PROJECT.supabase.co/auth/v1/token?grant_type=password](https://PROJECT.supabase.co/auth/v1/token?grant_type=password)',
        method: 'POST',
        data: payload,
        headers: { "apikey": "YOUR_KEY" },
        success: (res) => {
            localStorage.setItem('sb-token', res.access_token);
            location.hash = 'data';
        }
    });
});

```

### 5. Deployment Vercel

Gunakan file `vercel.json` agar routing SPA tidak error 404 saat di-refresh:

```json
{
  "version": 2,
  "cleanUrls": true,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

```

---

## 🛠️ Core Library Script

Masukkan kode ini di dalam tag `<script>` file HTML Anda:

```javascript
const $=(s)=>{const e=document.querySelectorAll(s),t={element:e.length===1?e[0]:[...e],html:s=>(e.forEach(e=>e.innerHTML=s),t),on:(s,l)=>(e.forEach(e=>e.addEventListener(s,l)),t),css:s=>(e.forEach(e=>Object.assign(e.style,s)),t),attr:(s,l)=>void 0===l?e[0]?e[0].getAttribute(s):null:(e.forEach(e=>e.setAttribute(s,l)),t),serialize:()=>{const s={};return e.forEach(e=>{"FORM"===e.tagName&&new FormData(e).forEach((e,t)=>s[t]=e)}),s},render:(s)=>{e.forEach(e=>{let l=e.getAttribute("data-tpl")||e.innerHTML;e.getAttribute("data-tpl")||e.setAttribute("data-tpl",l);e.innerHTML=Array.isArray(s)?s.map(s=>l.replace(/\{\{(.*?)\}\}/g,(e,t)=>s[t.trim()]||"")).join(""):l.replace(/\{\{(.*?)\}\}/g,(e,t)=>s[t.trim()]||"")});return t}};return t};$.ajax=async({url:s,method:e="GET",data:t=null,headers:l={},success:a,error:r})=>{try{const n=e.toUpperCase(),c=await fetch(s,{method:n,headers:{"Content-Type":"application/json",...l},..."GET"!==n&&t?{body:JSON.stringify(t)}:{}});if(!c.ok)throw Error(`HTTP error! status: ${c.status}`);const d=await c.json();return a&&a(d),d}catch(s){if(r)r(s);throw s}};$.state=(s,e)=>new Proxy(s,{set:(s,t,l)=>(s[t]=l,e(s),!0)});$.route=(r)=>{const l=()=>{const s=location.hash.slice(1)||"/",a=r[s]||r["404"];a&&a()};window.onhashchange=l;l()};

```