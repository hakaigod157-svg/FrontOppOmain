<script setup>
defineProps({ title: { type: String, default: "" }, subtitle: { type: String, default: "" }, image: { type: String, default: "" } });
defineEmits(["click"]);
</script>
<template>
  <article class="type-card" role="button" tabindex="0" @click="$emit('click')" @keydown.enter="$emit('click')" @keydown.space.prevent="$emit('click')">
    <div class="type-card__image">
      <div class="type-card__image-bg" :style="{ backgroundImage: `url(${image})` }" />
      <div class="type-card__image-overlay" />
      <div class="type-card__text-overlay" />
    </div>
    <div class="type-card__info"><h3 class="type-card__name">{{ title }}</h3><p class="type-card__sub">{{ subtitle }}</p></div>
    <span class="type-card__action" aria-hidden="true"><v-icon size="28" color="#0b3b17">mdi-arrow-right</v-icon></span>
  </article>
</template>
<style scoped lang="scss">
.type-card { width:240px; min-height:420px; border-radius:6px; overflow:hidden; isolation:isolate; position:relative; cursor:pointer; display:flex; flex-direction:column; border:1px solid rgba(255,255,255,.62); transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease; background-color:#0b3b17; }
.type-card:hover { transform:translateY(-3px); box-shadow:0 10px 22px rgba(8,35,15,.22); border-color:rgba(255,255,255,.9); }
.type-card:hover .type-card__image-bg { transform:scale(1.03); }
.type-card:hover .type-card__action { background-color:#c8e6c9; }
.type-card__image { position:absolute; inset:0; overflow:hidden; border-radius:17px; clip-path:inset(0 round 17px); background:#24432d; }
.type-card__image-bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:transform .35s ease; }
.type-card__image-overlay { position:absolute; inset:0; background:linear-gradient(180deg,rgba(11,59,23,.34) 0%,rgba(11,59,23,.42) 48%,rgba(8,35,15,.78) 100%); }
.type-card__text-overlay { position:absolute; inset:0; clip-path:polygon(100% 0,100% 100%,0 100%); border-radius:17px; background:rgba(8,45,18,.14); -webkit-mask-image:linear-gradient(135deg,transparent 36%,#000 74%); mask-image:linear-gradient(135deg,transparent 36%,#000 74%); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); }
.type-card__info { position:absolute; z-index:2; left:22%; right:12px; bottom:84px; min-height:124px; display:flex; flex-direction:column; align-items:flex-end; justify-content:flex-end; gap:6px; text-align:right; }
.type-card__name { width:100%; min-height:2.3em; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; font-size:1rem; font-weight:800; line-height:1.2; letter-spacing:.4px; text-transform:uppercase; color:#fff; margin:0; text-shadow:0 1px 4px rgba(0,0,0,.75); }
.type-card__sub { width:100%; min-height:3.75em; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3; overflow:hidden; font-size:.82rem; line-height:1.25; color:rgba(255,255,255,.9); margin:0; padding:0; background:transparent; border-radius:0; }
.type-card__action { position:absolute; z-index:3; right:22px; bottom:18px; display:flex; align-items:center; justify-content:center; width:48px; height:48px; padding:12px; border:1px solid rgba(255,255,255,.72); border-radius:3px; background-color:#d1f003; box-shadow:0 4px 14px rgba(22,96,48,.18); transition:background-color .2s ease; }
@media(max-width:1024px) { .type-card { width:200px; min-height:360px; } }
@media(max-width:768px) { .type-card { width:280px; min-height:340px; } }
</style>
