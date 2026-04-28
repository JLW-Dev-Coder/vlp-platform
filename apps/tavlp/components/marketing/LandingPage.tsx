'use client'

import { useEffect } from 'react'

const CSS = `
*[data-tavlp-landing] *,*[data-tavlp-landing] *::before,*[data-tavlp-landing] *::after{box-sizing:border-box;margin:0;padding:0}
[data-tavlp-landing]{
  --brand:#ec4899;--brand-light:#f472b6;--brand-dark:#db2777;
  --bg:#020617;--surface:rgba(255,255,255,0.015);
  --border:rgba(255,255,255,0.06);--border-brand:rgba(236,72,153,0.15);
  --text:#f1f5f9;--muted:rgba(255,255,255,0.50);--dim:rgba(255,255,255,0.25);--ghost:rgba(255,255,255,0.10);
  --green:#10b981;--green-light:#86efac;--green-dim:rgba(16,185,129,0.12);
  --amber:#f59e0b;--amber-light:#fbbf24;
  font-family:'Sora',system-ui,sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;display:block;position:relative
}
[data-tavlp-landing] .bg-fx{position:absolute;inset:0;pointer-events:none;z-index:0}
[data-tavlp-landing] .blob{position:absolute;border-radius:9999px;filter:blur(100px);will-change:transform}
[data-tavlp-landing] .b1{width:36rem;height:36rem;top:-12rem;left:-14rem;opacity:.12;background:radial-gradient(circle,rgba(236,72,153,.2) 0%,transparent 70%);animation:tavlp-f1 32s ease-in-out infinite alternate}
[data-tavlp-landing] .b2{width:40rem;height:40rem;bottom:10rem;right:-16rem;opacity:.07;background:radial-gradient(circle,rgba(16,185,129,.12) 0%,transparent 72%);animation:tavlp-f2 36s ease-in-out infinite alternate}
[data-tavlp-landing] .b3{width:28rem;height:28rem;top:50%;left:50%;transform:translate(-50%,-50%);opacity:.04;background:radial-gradient(circle,rgba(236,72,153,.15) 0%,transparent 65%);animation:tavlp-f3 40s ease-in-out infinite alternate}
[data-tavlp-landing] .noise{position:absolute;inset:0;opacity:.025;background-image:radial-gradient(rgba(255,255,255,.1) .5px,transparent .5px);background-size:6px 6px}
@keyframes tavlp-f1{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(8rem,5rem,0) scale(1.1)}}
@keyframes tavlp-f2{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(-6rem,-3rem,0) scale(1.08)}}
@keyframes tavlp-f3{0%{transform:translate3d(-50%,-50%,0) scale(1)}100%{transform:translate3d(-45%,-55%,0) scale(1.15)}}
@keyframes tavlp-fadeUp{from{opacity:0;transform:translateY(1.5rem)}to{opacity:1;transform:translateY(0)}}
@keyframes tavlp-pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes tavlp-wiggle{0%,100%{transform:rotate(0deg) scale(1)}15%{transform:rotate(-2deg) scale(1.02)}30%{transform:rotate(2.5deg) scale(1.03)}45%{transform:rotate(-1.5deg) scale(1.02)}60%{transform:rotate(1deg) scale(1.01)}75%{transform:rotate(-.5deg) scale(1)}90%{transform:rotate(0deg) scale(1)}}
@keyframes tavlp-loadFade{0%{opacity:1}100%{opacity:0;pointer-events:none;visibility:hidden}}
@keyframes tavlp-loadSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes tavlp-loadPulse{0%,100%{opacity:.4;transform:scale(.95)}50%{opacity:1;transform:scale(1)}}
@keyframes tavlp-revealUp{from{opacity:0;transform:translateY(2.5rem)}to{opacity:1;transform:translateY(0)}}
[data-tavlp-landing] .loader{position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;transition:opacity .6s ease,visibility .6s ease}
[data-tavlp-landing] .loader.done{animation:tavlp-loadFade .6s ease forwards}
[data-tavlp-landing] .loader-icon{width:3.5rem;height:3.5rem;border-radius:1rem;background:linear-gradient(135deg,var(--brand),var(--brand-dark));display:flex;align-items:center;justify-content:center;animation:tavlp-loadPulse 1.4s ease-in-out infinite}
[data-tavlp-landing] .loader-ring{width:2rem;height:2rem;border:2px solid rgba(255,255,255,.1);border-top-color:var(--brand-light);border-radius:50%;animation:tavlp-loadSpin .8s linear infinite}
[data-tavlp-landing] .loader-text{font-size:.6875rem;color:var(--dim);text-transform:uppercase;letter-spacing:.2em;font-weight:500}
[data-tavlp-landing] .reveal{opacity:0;transform:translateY(2.5rem);transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1)}
[data-tavlp-landing] .reveal.visible{opacity:1;transform:translateY(0)}
[data-tavlp-landing] .page{position:relative;z-index:1}
[data-tavlp-landing] section{padding:6rem 1.5rem}
@media(min-width:640px){[data-tavlp-landing] section{padding:10rem 2.5rem}}
@media(min-width:1024px){[data-tavlp-landing] section{padding:14rem 3rem}}
[data-tavlp-landing] .inner{max-width:72rem;margin:0 auto}
[data-tavlp-landing] .inner-wide{max-width:80rem;margin:0 auto}
[data-tavlp-landing] .divider{width:4rem;height:2px;background:rgba(236,72,153,.2);margin:0 auto}
[data-tavlp-landing] .badge{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1.25rem;border-radius:9999px;background:rgba(236,72,153,.05);border:1px solid rgba(236,72,153,.12);font-size:.875rem;color:var(--brand-light);font-weight:500}
[data-tavlp-landing] .badge-dot{width:6px;height:6px;border-radius:50%;background:var(--brand);animation:tavlp-pulse 2s ease-in-out infinite}
[data-tavlp-landing] h1{font-size:3rem;font-weight:800;line-height:1.05;letter-spacing:-.03em;color:var(--text)}
@media(min-width:640px){[data-tavlp-landing] h1{font-size:4rem}}
@media(min-width:1024px){[data-tavlp-landing] h1{font-size:5rem}}
[data-tavlp-landing] .grad{background:linear-gradient(135deg,#ec4899,#f472b6,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
[data-tavlp-landing] h2{font-size:2.25rem;font-weight:700;line-height:1.1;letter-spacing:-.025em;color:var(--text)}
@media(min-width:640px){[data-tavlp-landing] h2{font-size:3rem}}
@media(min-width:1024px){[data-tavlp-landing] h2{font-size:3.5rem}}
[data-tavlp-landing] h3{font-size:1.25rem;font-weight:600;line-height:1.3;color:var(--text)}
[data-tavlp-landing] .label{font-size:.625rem;color:var(--dim);text-transform:uppercase;letter-spacing:.25em;font-weight:600;margin-bottom:1.25rem}
[data-tavlp-landing] .body-text{font-size:1.125rem;color:var(--muted);line-height:1.8}
@media(min-width:640px){[data-tavlp-landing] .body-text{font-size:1.25rem}}
[data-tavlp-landing] .cta{display:inline-flex;align-items:center;gap:.625rem;padding:1.125rem 3rem;border-radius:.625rem;background:linear-gradient(135deg,var(--brand),var(--brand-dark));color:#fff;font-weight:600;font-size:1.0625rem;text-decoration:none;border:none;cursor:pointer;font-family:inherit;transition:all .2s;box-shadow:0 0 30px rgba(236,72,153,.18);animation:tavlp-wiggle 3s ease-in-out infinite;animation-delay:2s}
[data-tavlp-landing] .cta:hover{filter:brightness(1.1);transform:translateY(-2px) scale(1.03);box-shadow:0 0 40px rgba(236,72,153,.3);animation:none}
[data-tavlp-landing] .kennedy-embed{max-width:760px;margin:3rem auto 0;border-radius:1.25rem;overflow:hidden;border:1px solid var(--border-brand);background:rgba(236,72,153,.02)}
[data-tavlp-landing] .kennedy-embed video,[data-tavlp-landing] .kennedy-embed iframe{width:100%;aspect-ratio:16/9;display:block;background:#000}
[data-tavlp-landing] .kennedy-embed-label{padding:.625rem 1rem;display:flex;align-items:center;gap:.5rem}
[data-tavlp-landing] .kennedy-embed-label p{font-size:.6875rem;color:var(--dim)}
[data-tavlp-landing] .kennedy-dot{width:5px;height:5px;border-radius:50%;background:var(--brand);flex-shrink:0}
[data-tavlp-landing] .problems{margin-top:4rem}
[data-tavlp-landing] .problem{display:grid;grid-template-columns:1fr;gap:0;border-bottom:1px solid var(--border);padding:2.25rem 0}
[data-tavlp-landing] .problem:first-child{border-top:1px solid var(--border)}
@media(min-width:640px){[data-tavlp-landing] .problem{grid-template-columns:1fr 1fr;gap:3rem}}
[data-tavlp-landing] .problem-you{font-size:1.0625rem;color:rgba(255,255,255,.35);line-height:1.7;font-style:italic}
[data-tavlp-landing] .problem-us{font-size:1.0625rem;color:var(--brand-light);line-height:1.7;font-weight:500;margin-top:.625rem}
@media(min-width:640px){[data-tavlp-landing] .problem-us{margin-top:0}}
[data-tavlp-landing] .problem-num{display:inline-flex;width:1.5rem;height:1.5rem;border-radius:.375rem;background:rgba(236,72,153,.08);color:var(--brand);font-size:.625rem;font-weight:700;align-items:center;justify-content:center;margin-right:.5rem;flex-shrink:0;vertical-align:middle}
[data-tavlp-landing] .flow-compare{display:grid;grid-template-columns:1fr;gap:2.5rem;margin-top:4rem}
@media(min-width:768px){[data-tavlp-landing] .flow-compare{grid-template-columns:1fr auto 1fr}}
[data-tavlp-landing] .flow-col{border-radius:1.25rem;padding:2.5rem;border:1px solid var(--border)}
[data-tavlp-landing] .flow-col-old{background:rgba(255,255,255,.01)}
[data-tavlp-landing] .flow-col-new{border-color:rgba(236,72,153,.2);background:rgba(236,72,153,.02)}
[data-tavlp-landing] .flow-step{display:flex;gap:1rem;padding:1rem 0;font-size:.9375rem;color:var(--muted);line-height:1.6}
[data-tavlp-landing] .flow-step+.flow-step{border-top:1px solid var(--border)}
[data-tavlp-landing] .flow-icon{flex-shrink:0;width:1.5rem;height:1.5rem;border-radius:.375rem;display:flex;align-items:center;justify-content:center;font-size:.75rem;margin-top:.125rem}
[data-tavlp-landing] .flow-arrow{display:none;align-items:center;justify-content:center;font-size:2rem;color:var(--dim)}
@media(min-width:768px){[data-tavlp-landing] .flow-arrow{display:flex}}
[data-tavlp-landing] .flow-label{font-size:.5625rem;text-transform:uppercase;letter-spacing:.15em;font-weight:600;margin-bottom:1rem}
[data-tavlp-landing] .pains{display:grid;grid-template-columns:1fr;gap:1.25rem;margin-top:4rem}
@media(min-width:640px){[data-tavlp-landing] .pains{grid-template-columns:1fr 1fr}}
[data-tavlp-landing] .pain{display:flex;gap:1rem;padding:1.25rem 1.5rem;border-radius:1rem;border:1px solid var(--border);background:var(--surface)}
[data-tavlp-landing] .pain-icon{flex-shrink:0;width:2.25rem;height:2.25rem;border-radius:.625rem;background:rgba(236,72,153,.06);display:flex;align-items:center;justify-content:center}
[data-tavlp-landing] .pain p{font-size:.9375rem;color:var(--muted);line-height:1.7}
[data-tavlp-landing] .pain strong{color:rgba(255,255,255,.75);font-weight:600}
[data-tavlp-landing] .avatars{display:grid;grid-template-columns:1fr;gap:2rem;margin-top:4rem}
@media(min-width:640px){[data-tavlp-landing] .avatars{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){[data-tavlp-landing] .avatars{grid-template-columns:repeat(3,1fr)}}
[data-tavlp-landing] .avatar-card{border-radius:1.25rem;border:1px solid var(--border);background:var(--surface);overflow:hidden;transition:all .3s;text-decoration:none;color:inherit;display:flex;flex-direction:column}
[data-tavlp-landing] .avatar-card:hover{border-color:rgba(236,72,153,.3);transform:translateY(-6px);box-shadow:0 16px 48px rgba(0,0,0,.35)}
[data-tavlp-landing] .avatar-video{width:100%;aspect-ratio:16/9;display:block;background:#000;border-bottom:1px solid var(--border)}
[data-tavlp-landing] .avatar-img{width:100%;aspect-ratio:4/3;object-fit:cover;object-position:top;display:block}
[data-tavlp-landing] .avatar-info{padding:1.5rem;flex:1;display:flex;flex-direction:column}
[data-tavlp-landing] .avatar-info h3{font-size:1.25rem;margin-bottom:.375rem}
[data-tavlp-landing] .avatar-info p{font-size:.875rem;color:var(--muted);line-height:1.6;flex:1}
[data-tavlp-landing] .avatar-meta{display:flex;align-items:center;justify-content:space-between;margin-top:1rem;gap:.75rem}
[data-tavlp-landing] .avatar-role{display:inline-block;padding:.25rem .75rem;border-radius:9999px;font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;flex-shrink:0}
[data-tavlp-landing] .avatar-looks{font-size:.6875rem;color:var(--dim);font-weight:500}
[data-tavlp-landing] .avatar-choose{display:block;margin:0 1.5rem 1.5rem;padding:.75rem;border-radius:.5rem;background:linear-gradient(135deg,var(--brand),var(--brand-dark));color:#fff;font-weight:600;font-size:.875rem;text-align:center;text-decoration:none;border:none;cursor:pointer;font-family:inherit;transition:all .2s}
[data-tavlp-landing] .avatar-choose:hover{filter:brightness(1.1);transform:translateY(-1px)}
[data-tavlp-landing] .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:2rem;margin-top:4rem}
@media(min-width:768px){[data-tavlp-landing] .stats{grid-template-columns:repeat(4,1fr);gap:3rem}}
[data-tavlp-landing] .stat{text-align:center}
[data-tavlp-landing] .stat-num{font-size:2.5rem;font-weight:800;line-height:1}
@media(min-width:640px){[data-tavlp-landing] .stat-num{font-size:3.5rem}}
[data-tavlp-landing] .stat-label{font-size:.875rem;color:var(--muted);margin-top:.75rem;line-height:1.4}
[data-tavlp-landing] .steps{display:grid;gap:4rem;margin-top:4rem}
@media(min-width:768px){[data-tavlp-landing] .steps{grid-template-columns:repeat(4,1fr);gap:3rem}}
[data-tavlp-landing] .step-num{width:3.5rem;height:3.5rem;border-radius:1rem;background:linear-gradient(135deg,var(--brand),var(--brand-dark));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.25rem;color:#fff;margin-bottom:1.25rem}
[data-tavlp-landing] .step h3{margin-bottom:.625rem;font-size:1.375rem}
[data-tavlp-landing] .step p{font-size:.9375rem;color:var(--muted);line-height:1.7}
[data-tavlp-landing] .features{display:grid;gap:1.5rem;margin-top:4rem}
[data-tavlp-landing] .feature{display:flex;gap:1.25rem;padding:1.5rem;border-radius:1rem;border:1px solid var(--border);background:var(--surface)}
[data-tavlp-landing] .feature-check{flex-shrink:0;width:2rem;height:2rem;border-radius:.5rem;background:rgba(16,185,129,.08);display:flex;align-items:center;justify-content:center}
[data-tavlp-landing] .feature h4{font-size:1.0625rem;font-weight:600;margin-bottom:.375rem;color:var(--text)}
[data-tavlp-landing] .feature p{font-size:.9375rem;color:var(--muted);line-height:1.7}
[data-tavlp-landing] .ch-row{display:grid;gap:2rem;margin-top:4rem}
@media(min-width:768px){[data-tavlp-landing] .ch-row{grid-template-columns:repeat(3,1fr)}}
[data-tavlp-landing] .ch-card{border-radius:1.25rem;border:1px solid var(--border);background:var(--surface);padding:2rem;transition:all .25s;cursor:pointer;text-decoration:none;color:inherit;display:block}
[data-tavlp-landing] .ch-card:hover{border-color:rgba(236,72,153,.25);background:rgba(236,72,153,.02);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.3)}
[data-tavlp-landing] .ch-icon{width:3rem;height:3rem;border-radius:.75rem;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0}
[data-tavlp-landing] .ch-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;text-align:center;margin-top:1.25rem}
[data-tavlp-landing] .ch-n{font-size:1.5rem;font-weight:700}
[data-tavlp-landing] .ch-l{font-size:.5625rem;text-transform:uppercase;letter-spacing:.15em;color:var(--dim)}
[data-tavlp-landing] .ch-visit{display:block;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);font-size:.75rem;color:var(--brand);text-align:center;font-weight:500}
[data-tavlp-landing] .proof-card{border-radius:1.25rem;border:1px solid var(--green-dim);background:rgba(16,185,129,.02);padding:2.25rem;margin-top:2rem}
[data-tavlp-landing] .proof-card p{font-size:1.0625rem;line-height:1.7}
[data-tavlp-landing] .proof-card strong{font-weight:600;color:var(--green-light)}
[data-tavlp-landing] .proof-card .quote{color:rgba(134,239,172,.55)}
[data-tavlp-landing] .proof-card .attr{display:block;margin-top:1rem;font-size:.875rem;color:rgba(134,239,172,.3)}
[data-tavlp-landing] .price-box{border-radius:1.5rem;border:1px solid rgba(236,72,153,.2);background:rgba(236,72,153,.03);padding:4rem 3rem;text-align:center;margin-top:4rem}
[data-tavlp-landing] .price-big{font-size:5rem;font-weight:800;color:var(--brand-light);line-height:1}
@media(min-width:640px){[data-tavlp-landing] .price-big{font-size:6rem}}
[data-tavlp-landing] .price-per{font-size:1.375rem;color:var(--muted)}
[data-tavlp-landing] .price-compare{display:inline-block;margin-top:1.25rem;padding:.5rem 1rem;border-radius:.5rem;background:rgba(16,185,129,.05);border:1px solid var(--green-dim);font-size:.8125rem;color:var(--green-light)}
[data-tavlp-landing] .diy-math{margin-top:2.5rem;text-align:left;max-width:40rem;margin-left:auto;margin-right:auto}
[data-tavlp-landing] .diy-row{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border);font-size:.8125rem}
[data-tavlp-landing] .diy-row span:first-child{color:var(--muted)}
[data-tavlp-landing] .diy-row span:last-child{font-weight:600}
[data-tavlp-landing] .diy-row.total{border-bottom:none;border-top:2px solid rgba(236,72,153,.2);margin-top:.25rem;padding-top:.75rem}
[data-tavlp-landing] .diy-row.total span:last-child{color:var(--brand-light);font-size:1rem}
[data-tavlp-landing] .faq{margin-top:4rem}
[data-tavlp-landing] .faq-item{border-bottom:1px solid var(--border)}
[data-tavlp-landing] .faq-item:first-child{border-top:1px solid var(--border)}
[data-tavlp-landing] .faq-q{width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.5rem 0;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left}
[data-tavlp-landing] .faq-q span{font-size:1.0625rem;font-weight:600;color:rgba(255,255,255,.8)}
[data-tavlp-landing] .faq-q svg{flex-shrink:0;color:var(--dim);transition:transform .2s}
[data-tavlp-landing] .faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease}
[data-tavlp-landing] .faq-a p{font-size:1rem;color:var(--muted);line-height:1.8;padding-bottom:1.5rem}
[data-tavlp-landing] .faq-item.open .faq-q svg{transform:rotate(180deg)}
[data-tavlp-landing] .faq-item.open .faq-a{max-height:20rem}
[data-tavlp-landing] .tree-wrap{border-radius:1.25rem;border:1px solid var(--border);background:var(--surface);padding:2rem;max-width:48rem;margin:3rem auto 0}
@media(min-width:640px){[data-tavlp-landing] .tree-wrap{padding:2.5rem}}
[data-tavlp-landing] .tree-h{font-size:1.25rem;font-weight:700;line-height:1.3;margin-bottom:.5rem;color:var(--text)}
[data-tavlp-landing] .tree-b{font-size:.875rem;color:var(--muted);line-height:1.7;margin-bottom:1.5rem;white-space:pre-line}
[data-tavlp-landing] .opt-btn{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;padding:1rem 1.25rem;border-radius:.75rem;border:1px solid var(--border);background:rgba(255,255,255,.02);color:rgba(255,255,255,.75);font-size:.875rem;font-family:inherit;cursor:pointer;transition:all .2s;margin-bottom:.625rem}
[data-tavlp-landing] .opt-btn:hover{background:rgba(255,255,255,.05);border-color:rgba(236,72,153,.3);color:#fff}
[data-tavlp-landing] .opt-btn svg{opacity:.2;transition:all .2s}
[data-tavlp-landing] .opt-btn:hover svg{opacity:1;color:var(--brand)}
[data-tavlp-landing] .back-btn{display:inline-flex;align-items:center;gap:.25rem;font-size:.75rem;color:var(--dim);background:none;border:none;cursor:pointer;font-family:inherit}
[data-tavlp-landing] .back-btn:hover{color:var(--muted)}
[data-tavlp-landing] .dot{height:4px;border-radius:2px;transition:all .3s}
[data-tavlp-landing] .dot-a{width:2rem;background:var(--brand)}
[data-tavlp-landing] .dot-i{width:.75rem;background:rgba(255,255,255,.08)}
[data-tavlp-landing] .f-label{display:block;font-size:.5625rem;color:var(--dim);text-transform:uppercase;letter-spacing:.15em;margin-bottom:.375rem}
[data-tavlp-landing] .f-input{width:100%;padding:.75rem 1rem;border-radius:.5rem;background:rgba(255,255,255,.03);border:1px solid var(--border);color:#fff;font-size:.875rem;font-family:inherit;outline:none;transition:all .2s}
[data-tavlp-landing] .f-input::placeholder{color:var(--dim)}
[data-tavlp-landing] .f-input:focus{border-color:rgba(236,72,153,.4);background:rgba(255,255,255,.05)}
[data-tavlp-landing] .f-grid{display:grid;grid-template-columns:1fr;gap:1rem}
@media(min-width:640px){[data-tavlp-landing] .f-grid-2{grid-template-columns:1fr 1fr}}
[data-tavlp-landing] .toggle-grp{display:flex;gap:.75rem;margin-top:.25rem}
[data-tavlp-landing] .toggle-btn{padding:.5rem 1rem;border-radius:.5rem;font-size:.875rem;border:1px solid var(--border);background:rgba(255,255,255,.02);color:var(--muted);cursor:pointer;font-family:inherit;transition:all .2s}
[data-tavlp-landing] .toggle-btn.on{border-color:rgba(236,72,153,.4);background:rgba(236,72,153,.05);color:var(--brand-light)}
[data-tavlp-landing] .submit-btn{width:100%;margin-top:1rem;padding:1rem;border-radius:.5rem;font-weight:600;font-size:.9375rem;border:none;cursor:pointer;font-family:inherit;background:linear-gradient(135deg,var(--brand),var(--brand-dark));color:#fff;transition:all .2s;box-shadow:0 0 20px rgba(236,72,153,.12);animation:tavlp-wiggle 3s ease-in-out infinite;animation-delay:1s}
[data-tavlp-landing] .submit-btn:hover{filter:brightness(1.1);animation:none}
[data-tavlp-landing] .submit-btn:disabled{opacity:.35;cursor:not-allowed;box-shadow:none;animation:none}
[data-tavlp-landing] .toast{position:fixed;bottom:1.5rem;right:1.5rem;z-index:50;max-width:22rem;padding:.875rem 1.25rem;border-radius:.875rem;border:1px solid rgba(16,185,129,.2);background:rgba(2,6,23,.9);backdrop-filter:blur(12px);transition:all .5s cubic-bezier(.4,0,.2,1)}
[data-tavlp-landing] .toast.h{transform:translateY(1rem);opacity:0;pointer-events:none}
[data-tavlp-landing] .toast.v{transform:translateY(0);opacity:1}
[data-tavlp-landing] .deadline-bar{position:sticky;top:0;z-index:40;padding:.5rem 1rem;text-align:center;font-size:.6875rem;font-weight:600;letter-spacing:.02em;background:rgba(236,72,153,.08);border-bottom:1px solid rgba(236,72,153,.15);backdrop-filter:blur(12px);color:var(--brand-light)}
[data-tavlp-landing] .deadline-bar span{color:rgba(255,255,255,.4);margin:0 .5rem}
[data-tavlp-landing] .success-icon{width:5rem;height:5rem;border-radius:50%;background:linear-gradient(135deg,rgba(236,72,153,.12),rgba(16,185,129,.12));border:2px solid rgba(16,185,129,.3);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;animation:tavlp-successPop .5s cubic-bezier(.175,.885,.32,1.275) forwards;opacity:0}
@keyframes tavlp-successPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes tavlp-confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(120px) rotate(720deg);opacity:0}}
@keyframes tavlp-successTextIn{0%{transform:translateY(1rem);opacity:0}100%{transform:translateY(0);opacity:1}}
[data-tavlp-landing] .confetti-wrap{position:absolute;top:0;left:0;right:0;height:100%;pointer-events:none;overflow:hidden}
[data-tavlp-landing] .confetti-dot{position:absolute;width:6px;height:6px;border-radius:50%;animation:tavlp-confettiFall 2s ease-in forwards}
[data-tavlp-landing] .success-h{font-size:1.75rem;font-weight:800;margin-bottom:.5rem;animation:tavlp-successTextIn .5s ease forwards;animation-delay:.3s;opacity:0;color:var(--text)}
[data-tavlp-landing] .success-grad{background:linear-gradient(135deg,#ec4899,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
[data-tavlp-landing] .success-p{font-size:1rem;color:var(--muted);max-width:24rem;margin:0 auto;line-height:1.7;animation:tavlp-successTextIn .5s ease forwards;animation-delay:.5s;opacity:0}
[data-tavlp-landing] .success-links{display:flex;flex-direction:column;gap:.75rem;align-items:center;margin-top:1.5rem;animation:tavlp-successTextIn .5s ease forwards;animation-delay:.7s;opacity:0}
[data-tavlp-landing] .success-link{display:inline-flex;align-items:center;gap:.5rem;font-size:.9375rem;font-weight:500;text-decoration:none;transition:all .2s}
[data-tavlp-landing] .success-cta{padding:.75rem 2rem;border-radius:.5rem;background:linear-gradient(135deg,var(--brand),var(--brand-dark));color:#fff;font-weight:600;font-size:.9375rem;text-decoration:none;transition:all .2s;animation:tavlp-wiggle 3s ease-in-out infinite;animation-delay:2s}
[data-tavlp-landing] .success-cta:hover{filter:brightness(1.1);transform:translateY(-1px);animation:none}
[data-tavlp-landing] .countdown{display:inline-flex;gap:.25rem;font-family:'Sora',monospace;font-size:.6875rem;letter-spacing:.05em;color:var(--brand-light);font-weight:600}
[data-tavlp-landing] footer.tavlp-foot{padding:4rem 1.5rem;text-align:center}
[data-tavlp-landing] footer.tavlp-foot a{color:rgba(236,72,153,.35);text-decoration:none;font-size:.75rem;transition:color .2s;margin:0 .75rem}
[data-tavlp-landing] footer.tavlp-foot a:hover{color:var(--brand)}
`

const BODY_HTML = `
  <div class="bg-fx" aria-hidden="true"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="noise"></div></div>

  <div class="deadline-bar">
    Kwong claim deadline: July 10, 2026<span>·</span><span id="tavlp-countdown" class="countdown"></span> remaining
  </div>

  <div id="tavlp-toast" class="toast h">
    <div style="display:flex;gap:.75rem;align-items:start">
      <div style="width:6px;height:6px;border-radius:50%;background:#34d399;animation:tavlp-pulse 2s infinite;flex-shrink:0;margin-top:.4rem"></div>
      <div>
        <p id="tavlp-toast-text" style="font-size:.8125rem;color:#a7f3d0;font-weight:500;line-height:1.4"></p>
        <p style="font-size:.6875rem;color:rgba(167,243,208,.35);margin-top:.25rem">Your channel could be growing too.</p>
      </div>
    </div>
  </div>

  <div class="page">

    <section style="padding-top:6rem;padding-bottom:10rem;text-align:center">
      <div class="inner">
        <div class="badge" style="margin-bottom:2rem;opacity:0;animation:tavlp-revealUp .7s ease forwards;animation-delay:.4s">
          <div class="badge-dot"></div>
          923 organic views &middot; 30 days &middot; $0 ad spend
        </div>
        <h1 style="opacity:0;animation:tavlp-revealUp .7s ease forwards;animation-delay:.6s">
          You're not creating content.<br>
          <span class="grad">You're delegating it.</span>
        </h1>
        <p class="body-text" style="margin-top:1.5rem;max-width:40rem;margin-left:auto;margin-right:auto;opacity:0;animation:tavlp-revealUp .7s ease forwards;animation-delay:.85s">
          We build a faceless YouTube channel for your tax practice. An AI avatar scripts, records, and publishes IRS code explainers — every video drives viewers to your branded intake page. You get leads. She does the work.
        </p>
        <div style="margin-top:3.5rem;opacity:0;animation:tavlp-revealUp .7s ease forwards;animation-delay:1.05s">
          <a href="#start" class="cta">Get Your Avatar Channel →</a>
        </div>

        <div class="kennedy-embed" style="opacity:0;animation:tavlp-revealUp .7s ease forwards;animation-delay:1.25s">
          <video src="https://api.virtuallaunch.pro/tavlp/videos/S001-kennedy-hero-intro.mp4" controls playsinline style="width:100%;aspect-ratio:16/9;display:block;background:#000"></video>
          <div class="kennedy-embed-label">
            <div class="kennedy-dot"></div>
            <p>Kennedy &middot; AI Sales Avatar &middot; <a href="https://taxclaim.virtuallaunch.pro/kennedy" target="_blank" rel="noopener noreferrer" style="color:var(--brand);text-decoration:none">See her live on TaxClaim Pro →</a></p>
          </div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner">
        <p class="label">The problem</p>
        <h2>You already know you should have a YouTube channel. Here's why you don't.</h2>
        <p class="body-text" style="margin-top:1rem">
          These aren't production problems. They're identity problems. You became a tax professional to solve tax problems — not to learn video editing. That's the point.
        </p>

        <div class="problems">
          <div class="problem"><p class="problem-you"><span class="problem-num">1</span>"I'm a tax professional, not a content creator."</p><p class="problem-us">You're not creating content. You're delegating it.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">2</span>"I don't have time to script, record, and edit."</p><p class="problem-us">Your avatar scripts, records, and edits herself.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">3</span>"I tried once. It took 3 hours for one video."</p><p class="problem-us">Your avatar does one in 6 minutes.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">4</span>"My phone rings mid-take. Every. Single. Time."</p><p class="problem-us">Your avatar's phone never rings.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">5</span>"The comments section is a minefield."</p><p class="problem-us">Your avatar doesn't read comments. She reads IRS codes.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">6</span>"I'd rather spend that hour billing clients."</p><p class="problem-us">Your avatar bills zero hours and generates leads 24/7.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">7</span>"I don't want my face on the internet."</p><p class="problem-us">Go faceless. That's the whole point.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">8</span>"My competitor already has 10K subscribers."</p><p class="problem-us">They spent 3 years getting there. You can start this week.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">9</span>"A taxpayer Googled 'IRS Code 810' last Tuesday. They found someone else."</p><p class="problem-us">Next Tuesday, they find you.</p></div>
          <div class="problem"><p class="problem-you"><span class="problem-num">10</span>"I know I should be doing this. I'm just... not."</p><p class="problem-us">Now you don't have to. We do it for you.</p></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner-wide">
        <p class="label" style="text-align:center">The difference</p>
        <h2 style="text-align:center">The old way costs you $1,250 per video.<br>This costs $29/mo.</h2>

        <div class="flow-compare">
          <div class="flow-col flow-col-old">
            <p class="flow-label" style="color:rgba(255,255,255,.3)">❌ The old way</p>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(239,68,68,.08);color:#f87171">1</div><div>Research IRS code topic and draft a script <em style="color:var(--dim)">(45 min)</em></div></div>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(239,68,68,.08);color:#f87171">2</div><div>Set up lighting, camera, and mic <em style="color:var(--dim)">(20 min)</em></div></div>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(239,68,68,.08);color:#f87171">3</div><div>Record 4–7 takes until one is usable <em style="color:var(--dim)">(60 min)</em></div></div>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(239,68,68,.08);color:#f87171">4</div><div>Edit video, add captions, design thumbnail <em style="color:var(--dim)">(90 min)</em></div></div>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(239,68,68,.08);color:#f87171">5</div><div>Upload, write description, add tags <em style="color:var(--dim)">(15 min)</em></div></div>
            <div class="flow-step" style="border-top:2px solid rgba(239,68,68,.15);margin-top:.5rem;padding-top:.75rem"><div class="flow-icon" style="background:rgba(239,68,68,.12);color:#f87171">⏱</div><div><strong style="color:rgba(255,255,255,.5)">3–5 hours per video</strong><br>At $250/hr = <strong style="color:#f87171">$750–$1,250</strong> in lost billing</div></div>
          </div>

          <div class="flow-arrow">→</div>

          <div class="flow-col flow-col-new">
            <p class="flow-label" style="color:var(--brand)">✓ Tax Avatar Pro</p>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(236,72,153,.08);color:var(--brand)">1</div><div>Send one photo. We create your AI avatar.</div></div>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(236,72,153,.08);color:var(--brand)">2</div><div>We script IRS code explainer content.</div></div>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(236,72,153,.08);color:var(--brand)">3</div><div>Avatar records. Perfect take, every time.</div></div>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(236,72,153,.08);color:var(--brand)">4</div><div>We publish with your CTA and branding.</div></div>
            <div class="flow-step"><div class="flow-icon" style="background:rgba(236,72,153,.08);color:var(--brand)">5</div><div>Leads land on your dashboard. You review.</div></div>
            <div class="flow-step" style="border-top:2px solid rgba(236,72,153,.2);margin-top:.5rem;padding-top:.75rem"><div class="flow-icon" style="background:rgba(236,72,153,.12);color:var(--brand)">⏱</div><div><strong style="color:rgba(255,255,255,.65)">0 hours from you</strong><br>Your cost: <strong style="color:var(--brand-light)">$29/mo</strong></div></div>
          </div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner-wide">
        <p class="label" style="text-align:center">Why an avatar</p>
        <h2 style="text-align:center">Everything a human YouTuber deals with. None of it applies to your avatar.</h2>

        <div class="pains">
          <div class="pain"><div class="pain-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><div><p><strong>Perfect lighting every take.</strong> No ring light. No window positioning. No golden hour.</p></div></div>
          <div class="pain"><div class="pain-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div><p><strong>Multiple pre-set looks.</strong> No wardrobe decisions. No makeup. No "what do I wear today."</p></div></div>
          <div class="pain"><div class="pain-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div><div><p><strong>Never flubs a line.</strong> No re-recording. No "uh." No starting over.</p></div></div>
          <div class="pain"><div class="pain-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div><div><p><strong>No outside noise.</strong> No barking dogs. No leaf blowers. No kids.</p></div></div>
          <div class="pain"><div class="pain-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div><p><strong>No interruptions.</strong> No family walking into frame. No calls mid-take.</p></div></div>
          <div class="pain"><div class="pain-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div><p><strong>No mean comments affecting confidence.</strong> Your avatar doesn't have feelings. She has scripts.</p></div></div>
          <div class="pain"><div class="pain-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div><p><strong>Available 24/7.</strong> Publishes on schedule. Never takes a sick day. Never needs a break between sales calls.</p></div></div>
          <div class="pain"><div class="pain-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg></div><div><p><strong>Compounds while you sleep.</strong> Every video published is another entry point. The channel grows whether you're working or not.</p></div></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner-wide">
        <p class="label" style="text-align:center">How it works</p>
        <h2 style="text-align:center">Photo in. Leads out.</h2>
        <div class="steps">
          <div class="step"><div class="step-num">1</div><h3>Send a photo</h3><p>One professional headshot. We generate your lifelike AI avatar with multiple looks. Or pick from our library — Kennedy, Gala, and Vesperi are already proven.</p></div>
          <div class="step"><div class="step-num">2</div><h3>We build your channel</h3><p>Branded to your firm. Thumbnails, descriptions, content calendar — all IRS code explainers your clients are already searching for. Code 150. Code 810. Code 826. Code 971.</p></div>
          <div class="step"><div class="step-num">3</div><h3>Avatar publishes weekly</h3><p>Shorts and long-form. Every video ends with your CTA driving to your branded intake page. Viewers become leads without you lifting a finger.</p></div>
          <div class="step"><div class="step-num">4</div><h3>Leads on your dashboard</h3><p>Taxpayers self-serve the intake. Form 843 generates automatically. You get notified via email. Review, sign, mail. That's your entire workflow.</p></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner-wide">
        <p class="label" style="text-align:center">Choose your avatar</p>
        <h2 style="text-align:center">Six faces. One job:<br>bring you leads.</h2>
        <p class="body-text" style="text-align:center;max-width:40rem;margin:.75rem auto 0">
          Pick the avatar that represents your practice. Each one delivers the same proven IRS code explainer content — your brand, your CTA, your leads.
        </p>

        <div class="avatars">
          <div class="avatar-card"><video class="avatar-video" src="https://api.virtuallaunch.pro/tavlp/videos/A001-annie-intro.mp4" controls playsinline></video><div class="avatar-info"><h3>Annie</h3><p>57 looks. The most versatile avatar in the lineup. Boardroom presentations one week, approachable explainers the next. If you want range, Annie is your pick.</p><div class="avatar-meta"><span class="avatar-role" style="background:rgba(236,72,153,.08);color:var(--brand-light)">All Channel Types</span><span class="avatar-looks">57 looks</span></div></div><button class="avatar-choose" data-avatar="Annie">Choose Annie →</button></div>
          <div class="avatar-card"><video class="avatar-video" src="https://api.virtuallaunch.pro/tavlp/videos/V002-tariq-intro.mp4" controls playsinline></video><div class="avatar-info"><h3>Tariq</h3><p>Calm, methodical delivery. Perfect for technical IRS transcript content where credibility and clarity matter more than personality.</p><div class="avatar-meta"><span class="avatar-role" style="background:rgba(16,185,129,.08);color:var(--green-light)">Transcript Codes</span><span class="avatar-looks">14 looks</span></div></div><button class="avatar-choose" data-avatar="Tariq">Choose Tariq →</button></div>
          <div class="avatar-card"><video class="avatar-video" src="https://api.virtuallaunch.pro/tavlp/videos/V003-genesis-intro.mp4" controls playsinline></video><div class="avatar-info"><h3>Genesis</h3><p>Natural warmth that cuts through anxiety. Makes complex legal concepts like the Kwong ruling feel accessible, not intimidating.</p><div class="avatar-meta"><span class="avatar-role" style="background:rgba(249,115,22,.08);color:#fb923c">Penalty Abatement</span><span class="avatar-looks">12 looks</span></div></div><button class="avatar-choose" data-avatar="Genesis">Choose Genesis →</button></div>
          <div class="avatar-card"><video class="avatar-video" src="https://api.virtuallaunch.pro/tavlp/videos/A004-knox-intro.mp4" controls playsinline></video><div class="avatar-info"><h3>Knox</h3><p>The energy of someone who enjoys explaining how things work. Engaging without being over-the-top — perfect for educational tax content.</p><div class="avatar-meta"><span class="avatar-role" style="background:rgba(59,130,246,.08);color:#60a5fa">Tax Education</span><span class="avatar-looks">25 looks</span></div></div><button class="avatar-choose" data-avatar="Knox">Choose Knox →</button></div>
          <div class="avatar-card"><video class="avatar-video" src="https://api.virtuallaunch.pro/tavlp/videos/V005-denyse-intro.mp4" controls playsinline></video><div class="avatar-info"><h3>Denyse</h3><p>Professional polish with natural approachability. 33 looks keep your channel visually fresh even at high publishing frequency.</p><div class="avatar-meta"><span class="avatar-role" style="background:rgba(236,72,153,.08);color:var(--brand-light)">All Channel Types</span><span class="avatar-looks">33 looks</span></div></div><button class="avatar-choose" data-avatar="Denyse">Choose Denyse →</button></div>
          <div class="avatar-card"><video class="avatar-video" src="https://api.virtuallaunch.pro/tavlp/videos/A006-griffin-intro.mp4" controls playsinline></video><div class="avatar-info"><h3>Griffin</h3><p>Reads as someone who's been in the room. Premium, established feel from day one. The presence that makes viewers trust in three seconds.</p><div class="avatar-meta"><span class="avatar-role" style="background:rgba(16,185,129,.08);color:var(--green-light)">Authority & Trust</span><span class="avatar-looks">20 looks</span></div></div><button class="avatar-choose" data-avatar="Griffin">Choose Griffin →</button></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner">
        <p class="label">What you get</p>
        <h2>Everything included. Nothing to learn.</h2>
        <p class="body-text" style="margin-top:1rem">This is a fully managed service. You don't touch video software, thumbnail editors, or YouTube Studio. We handle all of it.</p>

        <div class="features">
          <div class="feature"><div class="feature-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h4>Custom AI Avatar</h4><p>Generated from your photo with multiple looks and outfits. Or choose from our proven library.</p></div></div>
          <div class="feature"><div class="feature-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h4>IRS Code Explainer Scripts</h4><p>Researched, accurate content covering the codes taxpayers actually search — 150, 810, 826, 971, and more.</p></div></div>
          <div class="feature"><div class="feature-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h4>Branded Channel Setup</h4><p>Your firm name, logo, and colors. Channel art, description, and SEO — all configured for you.</p></div></div>
          <div class="feature"><div class="feature-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h4>Weekly Publishing</h4><p>Shorts and long-form on a consistent schedule. Thumbnails, descriptions, and tags included.</p></div></div>
          <div class="feature"><div class="feature-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h4>Intake Page Integration</h4><p>Every video CTA drives to your TaxClaim Pro branded intake page. Taxpayers self-serve. Form 843 generates. You get notified.</p></div></div>
          <div class="feature"><div class="feature-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h4>Review & Approve Workflow</h4><p>You see every video before it goes live. Approve or request changes. You stay in control without doing the work.</p></div></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner">
        <p class="label">It's already working</p>
        <h2>Real views. Real comments. Real leads. Zero ad spend.</h2>
        <p class="body-text" style="margin-top:1rem">
          We launched three channels with zero paid promotion. No ads, no paid subscribers, no influencer shoutouts. Here's what happened in 30 days.
        </p>

        <div class="ch-row" id="tavlp-channels"></div>

        <div class="kennedy-embed" style="margin-top:2.5rem">
          <video src="https://api.virtuallaunch.pro/tavlp/videos/S002-kennedy-proof-section-video.mp4" controls playsinline style="width:100%;aspect-ratio:16/9;display:block;background:#000"></video>
          <div class="kennedy-embed-label">
            <div class="kennedy-dot"></div>
            <p>Kennedy &middot; Honest early-stage proof</p>
          </div>
        </div>

        <div class="proof-card">
          <p>
            <strong>Real lead from a 15-second Short:</strong>
            <span class="quote"> A taxpayer commented on our IRS Code 810 video asking for help with codes 810, 150, and 806 on their transcript — week 6 waiting for release. That's a qualified lead. Zero ad spend.</span>
            <span class="attr">— Phillip Gillian, via YouTube comment on @TaxTranscriptAI</span>
          </p>
        </div>

        <div class="proof-card">
          <p>
            <strong>Real engagement from a tax preparer:</strong>
            <span class="quote"> "Thank you for sharing the link! I have been looking up each code individually, and that's so helpful."</span>
            <span class="attr">— Conny R., Tax Preparer, via Facebook group</span>
          </p>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner">
        <p class="label" style="text-align:center">Pricing</p>
        <h2 style="text-align:center">The math isn't close.</h2>

        <div class="price-box">
          <span class="price-big">$29</span><span class="price-per">/mo</span>
          <p style="font-size:.9375rem;color:var(--muted);margin-top:1rem;line-height:1.6">
            Avatar creation &middot; Content production &middot; Channel management<br>
            Weekly publishing &middot; You review and approve &middot; Cancel anytime
          </p>
          <div class="price-compare">Add-on to TaxClaim Pro ($10/mo). Total: $39/mo for a fully managed channel + Form 843 automation.</div>

          <div class="diy-math">
            <p style="font-size:.5625rem;text-transform:uppercase;letter-spacing:.15em;color:var(--dim);margin-bottom:.75rem;font-weight:600">DIY cost per video</p>
            <div class="diy-row"><span>Freelancer scriptwriter</span><span>$50–$100</span></div>
            <div class="diy-row"><span>Freelancer video editor</span><span>$50–$200</span></div>
            <div class="diy-row"><span>Thumbnail designer</span><span>$10–$50</span></div>
            <div class="diy-row"><span>Your recording time (1–2 hrs @ $250/hr)</span><span style="color:#f87171">$250–$500</span></div>
            <div class="diy-row"><span>Your editing/review time</span><span style="color:#f87171">$125–$250</span></div>
            <div class="diy-row total"><span>Total per video (DIY)</span><span>$485–$1,100</span></div>
          </div>

          <p style="font-size:.8125rem;color:var(--dim);margin-top:2rem;line-height:1.7">
            4 videos per month at DIY rates = <strong style="color:#f87171">$1,940–$4,400/mo</strong>.<br>
            Tax Avatar Pro = <strong style="color:var(--brand-light)">$29/mo</strong>.
          </p>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner">
        <p class="label" style="text-align:center">Frequently asked</p>
        <h2 style="text-align:center">Questions you're already thinking.</h2>

        <div class="faq" id="tavlp-faq-list">
          <div class="faq-item"><button class="faq-q" data-faq><span>Will AI content get my channel banned?</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-a"><p>No. YouTube's 2026 policy allows AI-generated narration and presentation. What they ban is mass-produced, low-quality spam. Our content is IRS-specific, researched, educational, and published on a consistent schedule — exactly the kind of content YouTube promotes. Every video is reviewed before publishing.</p></div></div>
          <div class="faq-item"><button class="faq-q" data-faq><span>Won't my clients distrust a video from an avatar?</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-a"><p>Your clients aren't watching at 2pm in your office. They're searching "IRS Code 810" at midnight on their phone. Trust comes from accuracy — correct information delivered clearly. The avatar is the delivery mechanism. The IRS code explanation is the value. Ask yourself: when you search a topic on YouTube, do you care about the presenter's identity or the answer to your question?</p></div></div>
          <div class="faq-item"><button class="faq-q" data-faq><span>Can't I just do this myself with ChatGPT and Canva?</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-a"><p>You can. And at your billing rate of $250/hr, each video costs you 3–5 hours of billable time. That's $750 to $1,250 per video in opportunity cost. Or $29/mo for us to handle everything. The tools are available to anyone. The time isn't. That's what you're buying — your time back.</p></div></div>
          <div class="faq-item"><button class="faq-q" data-faq><span>What happens after the Kwong deadline?</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-a"><p>IRS codes don't expire. Code 150, 810, 826, 971 — taxpayers search these every single day regardless of Kwong. The ruling is launch fuel — it creates urgency for tax pros to sign up and urgency for taxpayers to find your content. But the IRS code explainer content drives views forever. Kwong gets you in the door. IRS codes keep the channel compounding.</p></div></div>
          <div class="faq-item"><button class="faq-q" data-faq><span>Do I need to be on TaxClaim Pro already?</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-a"><p>Tax Avatar Pro is a $29/mo add-on to TaxClaim Pro. If you're not on TCVLP yet, you can start at $10/mo for the Form 843 generation tool — that's what your avatar's video CTAs drive viewers to. The combo is $39/mo total for a fully managed YouTube channel plus automated Form 843 intake.</p></div></div>
          <div class="faq-item"><button class="faq-q" data-faq><span>How quickly will I see results?</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-a"><p>YouTube is a compounding channel, not a switch. Our proof-of-concept channels hit 923 views in 30 days with zero promotion. Your first videos will start indexing in YouTube search within days. But the real value compounds over months as your video library grows and each video becomes a permanent entry point for taxpayers searching IRS codes.</p></div></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section id="start">
      <div class="inner">
        <p class="label" style="text-align:center">Let's talk about it</p>
        <h2 style="text-align:center">The five hardest objections. Answered honestly.</h2>
        <p class="body-text" style="text-align:center;margin-top:.75rem">We'd rather you think it through than sign up and cancel. Pick the concern that's closest to yours.</p>

        <div class="kennedy-embed" style="margin-bottom:2rem">
          <video src="https://api.virtuallaunch.pro/tavlp/videos/V003-kennedy-close-pre-form-video.mp4" controls playsinline style="width:100%;aspect-ratio:16/9;display:block;background:#000"></video>
          <div class="kennedy-embed-label">
            <div class="kennedy-dot"></div>
            <p>Kennedy &middot; Let's do the math</p>
          </div>
        </div>

        <div class="tree-wrap" id="tavlp-tree-container">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
            <div style="display:flex;align-items:center;gap:.75rem">
              <div style="width:2.5rem;height:2.5rem;border-radius:.75rem;background:linear-gradient(135deg,var(--brand),var(--brand-dark));display:flex;align-items:center;justify-content:center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              </div>
              <div>
                <p style="font-size:.875rem;font-weight:600">Objection Handler</p>
                <p style="font-size:.6875rem;color:var(--dim)">Pick the one that's yours</p>
              </div>
            </div>
            <button class="back-btn" id="tavlp-back-btn" style="display:none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              Back
            </button>
          </div>
          <div id="tavlp-dots" style="display:flex;gap:.375rem;margin-bottom:1.5rem"></div>
          <div id="tavlp-tree"></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="reveal">
      <div class="inner" style="text-align:center">
        <p style="font-size:.625rem;color:var(--brand);text-transform:uppercase;letter-spacing:.15em;margin-bottom:1rem">Kwong v. United States — Deadline July 10, 2026</p>
        <h2>The window is closing. The channel compounds.</h2>
        <p class="body-text" style="margin-top:1rem;max-width:40rem;margin-left:auto;margin-right:auto">
          Every day without a channel is a day your competitors' videos rank higher for the IRS codes your clients are searching. A video published today still drives views in 6 months. But the Kwong deadline doesn't move. Your clients need to find you before July — not after.
        </p>
        <p class="body-text" style="margin-top:1rem;max-width:40rem;margin-left:auto;margin-right:auto;font-size:.875rem">
          400,000 CPAs left the industry in the last 5 years and 50% of those remaining retire within 7 years. The shortage extends to EAs and tax attorneys too — the entire profession is thinning. The firms that build client acquisition systems now — not next year, not next season — are the ones that survive the shortage.
        </p>
        <div style="margin-top:2.5rem">
          <a href="#start" class="cta">Get Your Avatar Channel — $29/mo →</a>
        </div>
      </div>
    </section>
  </div>
`

export default function LandingPage() {
  useEffect(() => {
    /* Countdown */
    function updateCountdown() {
      const target = new Date('2026-07-10T23:59:59-04:00').getTime()
      const now = Date.now()
      const diff = target - now
      const el = document.getElementById('tavlp-countdown')
      if (!el) return
      if (diff <= 0) { el.textContent = 'DEADLINE PASSED'; return }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      el.textContent = `${d}d ${h}h ${m}m`
    }
    updateCountdown()
    const cdInterval = window.setInterval(updateCountdown, 60000)

    /* Channels */
    type Channel = { name: string; handle: string; url: string; subs: number; views: number; videos: number; top_video?: string; top?: string; color: string }
    const CHS_FALLBACK: Channel[] = [
      { name: 'Tax Transcript AI', handle: '@TaxTranscriptAI', url: 'https://youtube.com/@TaxTranscriptAI', subs: 1, views: 923, videos: 26, top_video: 'IRS Code 150 — 475 views', color: '#14b8a6' },
      { name: 'Tax Tools Arcade', handle: '@taxtoolsarcade', url: 'https://youtube.com/@taxtoolsarcade', subs: 1, views: 482, videos: 7, top_video: 'Tax Mythbusters — 416 views', color: '#f97316' },
      { name: 'Tax Claim Pro', handle: '@taxclaimpro', url: 'https://youtube.com/@taxclaimpro', subs: 0, views: 30, videos: 11, top_video: 'How to Check Kwong v. US — 12 views', color: '#eab308' },
    ]
    function renderChannels(data: Channel[]) {
      const root = document.getElementById('tavlp-channels')
      if (!root) return
      root.innerHTML = data.map(c => {
        const top = c.top_video || c.top
        return `<a class="ch-card" href="${c.url}" target="_blank" rel="noopener noreferrer"><div style="display:flex;align-items:center;gap:.875rem;margin-bottom:1rem"><div class="ch-icon" style="background:${c.color}20;color:${c.color}">${c.name[0]}</div><div><p style="font-size:1rem;font-weight:600">${c.name}</p><p style="font-size:.75rem;color:var(--dim)">${c.handle}</p></div></div><div class="ch-stats"><div><p class="ch-n">${c.subs}</p><p class="ch-l">Subs</p></div><div><p class="ch-n">${(c.views || 0).toLocaleString()}</p><p class="ch-l">Views</p></div><div><p class="ch-n">${c.videos}</p><p class="ch-l">Videos</p></div></div>${top ? `<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)"><p style="font-size:.5625rem;color:var(--dim);text-transform:uppercase;letter-spacing:.12em;margin-bottom:.25rem">Top video</p><p style="font-size:.8125rem;color:var(--muted)">${top}</p></div>` : ''}<span class="ch-visit">Visit channel →</span></a>`
      }).join('')
    }
    renderChannels(CHS_FALLBACK)
    fetch('https://api.virtuallaunch.pro/tavlp/channel-stats.json')
      .then(r => r.ok ? r.json() : null)
      .then((data: { channels?: Channel[] } | null) => { if (data && Array.isArray(data.channels) && data.channels.length) renderChannels(data.channels) })
      .catch(() => {})

    /* Toast */
    const TS = [
      'Tax Transcript AI just got another view on \'IRS Code 150\'',
      "Someone watching 'IRS Code 826 — Refund Offset'",
      "New viewer: 'IRS Code 420 — Examination Indicator'",
      '475 views on top video — zero paid promotion',
      "Taxpayer searched 'IRS Code 810' and found our channel",
      'IRS Code 826 Short: 219 views in one day',
    ]
    let ti = 0
    function showT() {
      const e = document.getElementById('tavlp-toast'); const t = document.getElementById('tavlp-toast-text')
      if (!e || !t) return
      t.textContent = TS[ti % TS.length]
      e.className = 'toast v'; ti++
      window.setTimeout(() => { if (e) e.className = 'toast h' }, 4500)
    }
    showT()
    const toastInterval = window.setInterval(showT, 14000 + Math.random() * 6000)

    /* FAQ */
    const faqHandlers: Array<[HTMLButtonElement, () => void]> = []
    document.querySelectorAll<HTMLButtonElement>('[data-faq]').forEach(btn => {
      const handler = () => {
        const item = btn.parentElement
        if (!item) return
        const wasOpen = item.classList.contains('open')
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
        if (!wasOpen) item.classList.add('open')
      }
      btn.addEventListener('click', handler)
      faqHandlers.push([btn, handler])
    })

    /* Decision Tree */
    type TreeNode = { h: string; b: string | null; o: { l: string; n: string }[]; isForm?: boolean }
    const T: Record<string, TreeNode> = {
      s: {
        h: "What's holding you back?",
        b: "We've heard every objection. Pick the one that's closest to yours — we'll answer it honestly.",
        o: [
          { l: '"$29/mo on top of $10/mo and I have zero proof this works."', n: 'obj1' },
          { l: '"AI content will get my channel banned."', n: 'obj2' },
          { l: '"My clients won\'t trust a video from an avatar."', n: 'obj3' },
          { l: '"I can just do this myself with ChatGPT and Canva."', n: 'obj4' },
          { l: '"What happens after Kwong?"', n: 'obj5' },
        ],
      },
      obj1: { h: "Fair. Let's be honest about where we are.", b: "We're early. We launched three channels 30 days ago with zero paid promotion. Tax Transcript AI has 923 organic views and 26 videos. Our top video — IRS Code 150 — pulled 475 views. A real taxpayer commented asking for help with codes 810, 150, and 806 on their transcript.\n\nIs that millions of views? No. Is it proof that IRS code content gets found organically on YouTube? Yes.\n\nYou're paying $39/mo total ($10 TaxClaim Pro + $29 Tax Avatar Pro). One qualified lead covers months of that. And the channel compounds — every video you publish is a permanent entry point.\n\nThe question isn't whether $39/mo is worth one lead. It's whether you can afford another month of your competitor ranking for 'IRS Code 810' while you don't.", o: [{ l: "I'm ready. Let's start.", n: 'form' }, { l: 'I have another concern', n: 's' }] },
      obj2: { h: "YouTube's 2026 policy is clear on this.", b: "YouTube allows AI-generated narration and presentation. What they ban is mass-produced, low-quality spam — think auto-generated listicles with stock footage.\n\nOur content is the opposite: IRS-specific, researched, educational, published on a consistent schedule, and reviewed by a tax professional (you) before it goes live.\n\nYouTube promotes educational content that answers specific queries. An IRS Code 810 explainer that accurately walks through what the code means, why it appears on a transcript, and what to do next — that's exactly what YouTube wants on the platform.\n\nEvery video is reviewed by you before publishing. You approve the content. Your name is on the channel.", o: [{ l: "That makes sense. Let's start.", n: 'form' }, { l: 'I have another concern', n: 's' }] },
      obj3: { h: "Your clients aren't browsing — they're searching.", b: "Nobody finds your video by scrolling their feed and thinking 'nice avatar.' They find it by typing 'IRS Code 810 meaning' into YouTube at midnight because they just got a letter from the IRS.\n\nAt that moment, trust comes from one thing: does this video accurately explain what Code 810 means and what I should do next?\n\nThe avatar is the delivery mechanism. The IRS code explanation is the value. If the information is accurate, clear, and actionable — the viewer doesn't care whether a human or an avatar delivered it.\n\nAnd here's the thing — your name, your firm, and your branded intake page are what they click next. The avatar earns the view. Your credentials earn the trust.", o: [{ l: "That makes sense. Let's start.", n: 'form' }, { l: 'I have another concern', n: 's' }] },
      obj4: { h: "You absolutely can. Here's what it costs.", b: "ChatGPT can write the script. Canva can make the thumbnail. You can record on your phone. All true.\n\nBut here's the math:\n• Script + research: 45 minutes\n• Setup + recording (4–7 takes): 60 minutes\n• Editing + captions + thumbnail: 90 minutes\n• Upload + description + tags: 15 minutes\n\nThat's 3.5 hours minimum. At your billing rate ($250/hr), that's $875 in opportunity cost. Per video.\n\nFour videos per month = $3,500 in lost billing time.\n\nOr $29/mo. We script, record, edit, and publish. You review and approve.\n\nThe tools are available to anyone. Your time isn't. That's what you're buying back.", o: [{ l: "The math is clear. Let's start.", n: 'form' }, { l: 'I have another concern', n: 's' }] },
      obj5: { h: "IRS codes don't expire. Kwong does.", b: "The Kwong ruling creates urgency right now — taxpayers with penalties from Jan 2020 to July 2023 need to file Form 843 before the July 10, 2026 deadline. That's the launch fuel.\n\nBut Code 150 (tax return filed), Code 810 (refund freeze), Code 826 (refund offset), Code 971 (notice issued) — taxpayers search these every single day. Kwong or no Kwong.\n\nYour IRS code explainer videos are evergreen content. A video published today still drives views in 6 months, 12 months, 2 years. The channel compounds.\n\nKwong gets tax pros through the door right now. IRS codes keep the channel growing after the deadline passes. You're building an asset, not running a promotion.", o: [{ l: "Long game makes sense. Let's start.", n: 'form' }, { l: 'I have another concern', n: 's' }] },
      form: { h: "Let's get your channel started.", b: null, isForm: true, o: [] },
    }

    let cur = 's'
    let hist: string[] = ['s']
    let done = false
    let cred = 'ea'
    let hasCh = 'no'
    let selectedAvatar = ''

    function escape(str: string) { return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') }

    function render() {
      const n = T[cur]
      const c = document.getElementById('tavlp-tree')
      const bb = document.getElementById('tavlp-back-btn')
      const dd = document.getElementById('tavlp-dots')
      if (!c || !bb || !dd) return
      bb.style.display = hist.length > 1 && !done ? '' : 'none'
      dd.innerHTML = hist.map((_, i) => `<div class="dot ${i === hist.length - 1 ? 'dot-a' : 'dot-i'}"></div>`).join('')

      if (done) {
        const colors = ['#ec4899', '#f472b6', '#10b981', '#34d399', '#fb923c', '#fbbf24']
        let confetti = ''
        for (let i = 0; i < 24; i++) {
          const cc = colors[i % colors.length]
          const left = Math.random() * 100
          const delay = Math.random() * 1.5
          const size = 4 + Math.random() * 5
          confetti += `<div class="confetti-dot" style="left:${left}%;background:${cc};width:${size}px;height:${size}px;animation-delay:${delay}s;top:${Math.random() * 20}%"></div>`
        }
        c.innerHTML = `<div style="position:relative;text-align:center;padding:3rem 0">
          <div class="confetti-wrap">${confetti}</div>
          <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 class="success-h"><span class="success-grad">You're in.</span> Let's build your channel.</h3>
          <p class="success-p">We'll reach out within 24 hours to get you started. In the meantime, check out what your channel could look like.</p>
          <div class="success-links">
            <a href="https://youtube.com/@TaxTranscriptAI" target="_blank" rel="noopener noreferrer" class="success-cta">Watch Tax Transcript AI →</a>
            <a href="https://taxclaim.virtuallaunch.pro/kennedy" target="_blank" rel="noopener noreferrer" class="success-link" style="color:var(--brand)">Meet Kennedy on TaxClaim Pro →</a>
            <a href="https://cal.com/tax-monitor-pro/tax-avatar-virtual-launch-pro" target="_blank" rel="noopener noreferrer" class="success-link" style="color:var(--muted)">Or book a 15-min intro call →</a>
          </div>
        </div>`
        return
      }

      if (n.isForm) {
        c.innerHTML = `<h3 class="tree-h">${escape(n.h)}</h3>
        <div class="f-grid f-grid-2"><div><label class="f-label">Name *</label><input class="f-input" id="tavlp-fn" placeholder="Your full name"></div><div><label class="f-label">Email *</label><input class="f-input" id="tavlp-fe" type="email" placeholder="you@yourfirm.com"></div></div>
        <div class="f-grid f-grid-2" style="margin-top:1rem"><div><label class="f-label">Phone</label><input class="f-input" id="tavlp-fp" type="tel" placeholder="(555) 000-0000"></div><div><label class="f-label">Firm name</label><input class="f-input" id="tavlp-ff" placeholder="Your firm"></div></div>
        <div style="margin-top:1rem"><label class="f-label">Credential</label><div class="toggle-grp" data-grp="cred"><button class="toggle-btn ${cred==='ea'?'on':''}" data-v="ea">EA</button><button class="toggle-btn ${cred==='cpa'?'on':''}" data-v="cpa">CPA</button><button class="toggle-btn ${cred==='attorney'?'on':''}" data-v="attorney">Attorney</button><button class="toggle-btn ${cred==='other'?'on':''}" data-v="other">Other</button></div></div>
        <div style="margin-top:1rem"><label class="f-label">Your avatar</label><div class="toggle-grp" data-grp="av" style="flex-wrap:wrap"><button class="toggle-btn ${selectedAvatar==='Annie'?'on':''}" data-v="Annie">Annie</button><button class="toggle-btn ${selectedAvatar==='Tariq'?'on':''}" data-v="Tariq">Tariq</button><button class="toggle-btn ${selectedAvatar==='Genesis'?'on':''}" data-v="Genesis">Genesis</button><button class="toggle-btn ${selectedAvatar==='Knox'?'on':''}" data-v="Knox">Knox</button><button class="toggle-btn ${selectedAvatar==='Denyse'?'on':''}" data-v="Denyse">Denyse</button><button class="toggle-btn ${selectedAvatar==='Griffin'?'on':''}" data-v="Griffin">Griffin</button></div></div>
        <div style="margin-top:1rem"><label class="f-label">Do you have a YouTube channel?</label><div class="toggle-grp" data-grp="ch"><button class="toggle-btn ${hasCh==='no'?'on':''}" data-v="no">No</button><button class="toggle-btn ${hasCh==='yes'?'on':''}" data-v="yes">Yes</button><button class="toggle-btn ${hasCh==='tried'?'on':''}" data-v="tried">Tried & stopped</button></div></div>
        <button class="submit-btn" id="tavlp-sbtn">Get My Channel Started →</button>
        <p style="text-align:center;font-size:.6875rem;color:var(--ghost);margin-top:.75rem">We'll reach out within 24 hours. No spam. No obligation.</p>`

        c.querySelectorAll<HTMLDivElement>('.toggle-grp').forEach(grp => {
          const groupName = grp.dataset.grp || 'cred'
          grp.querySelectorAll<HTMLButtonElement>('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              grp.querySelectorAll('.toggle-btn').forEach(x => x.classList.remove('on'))
              btn.classList.add('on')
              const v = btn.dataset.v || ''
              if (groupName === 'ch') hasCh = v
              else if (groupName === 'av') selectedAvatar = v
              else cred = v
            })
          })
        })
        document.getElementById('tavlp-sbtn')?.addEventListener('click', doSubmit)
        return
      }

      c.innerHTML = `<h3 class="tree-h">${escape(n.h)}</h3>${n.b ? `<p class="tree-b">${escape(n.b)}</p>` : ''}`
      n.o.forEach(o => {
        const btn = document.createElement('button')
        btn.className = 'opt-btn'
        btn.innerHTML = `<span>${escape(o.l)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`
        btn.addEventListener('click', () => goTo(o.n))
        c.appendChild(btn)
      })
    }

    function goTo(id: string) {
      cur = id; hist.push(id); render()
      document.getElementById('tavlp-tree-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    function goBack() {
      if (hist.length <= 1) return
      hist.pop(); cur = hist[hist.length - 1]; render()
    }
    document.getElementById('tavlp-back-btn')?.addEventListener('click', goBack)

    async function doSubmit() {
      const n = (document.getElementById('tavlp-fn') as HTMLInputElement | null)?.value?.trim() || ''
      const e = (document.getElementById('tavlp-fe') as HTMLInputElement | null)?.value?.trim() || ''
      if (!n || !e) return
      const b = document.getElementById('tavlp-sbtn') as HTMLButtonElement | null
      if (b) { b.disabled = true; b.textContent = 'Submitting...' }
      try {
        await fetch('https://api.virtuallaunch.pro/v1/tcvlp/gala/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: n,
            email: e,
            phone: (document.getElementById('tavlp-fp') as HTMLInputElement | null)?.value || '',
            contact_pref: 'email',
            penalty_type: 'tavlp_channel_interest',
            tax_years: '2026',
            amount: '',
            source: 'tavlp_landing',
            firm_name: (document.getElementById('tavlp-ff') as HTMLInputElement | null)?.value || '',
            credential: cred,
            has_channel: hasCh,
            avatar: selectedAvatar,
          }),
        })
      } catch (err) { console.error(err) }
      done = true; render()
    }

    /* Choose avatar buttons in the showcase */
    const avatarChooseHandlers: Array<[HTMLButtonElement, () => void]> = []
    document.querySelectorAll<HTMLButtonElement>('.avatar-choose').forEach(btn => {
      const handler = () => {
        selectedAvatar = btn.dataset.avatar || ''
        cur = 'form'; hist = ['s', 'form']; render()
        document.getElementById('tavlp-tree-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      btn.addEventListener('click', handler)
      avatarChooseHandlers.push([btn, handler])
    })

    render()

    /* Scroll Reveal */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('[data-tavlp-landing] .reveal').forEach(el => observer.observe(el))

    return () => {
      window.clearInterval(cdInterval)
      window.clearInterval(toastInterval)
      observer.disconnect()
      faqHandlers.forEach(([btn, handler]) => btn.removeEventListener('click', handler))
      avatarChooseHandlers.forEach(([btn, handler]) => btn.removeEventListener('click', handler))
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div data-tavlp-landing dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
    </>
  )
}
