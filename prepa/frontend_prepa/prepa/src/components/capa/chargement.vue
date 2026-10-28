<!-- <template>
    <div class="loader-wrapper">
      <div id="loader1" class="loader">
        <div class="roller"></div>
        <div class="roller"></div>
      </div>
  
      <div id="loader2" class="loader">
        <div class="roller"></div>
        <div class="roller"></div>
      </div>
  
      <div id="loader3" class="loader">
        <div class="roller"></div>
        <div class="roller"></div>
      </div>
    </div>
  </template>
  
  <style lang="scss">
  $loader-duration: 2s;
  $loader-iteration-count: infinite;
  $body-bg: #fff;
  
  .loader-wrapper {
    width: 148px; 
    height: 100px;  
    position: absolute;
    margin: -50px 0 0 -74px;
    left: 50%;
    top: 60%;
  }
  
  .loader {
    width: 148px; 
    height: 100px; 
    top: 0;
    left: 0;
    position: absolute;
  
    &:after {
      content: "";
      top: auto;
      position: absolute;
      display: block;
      animation: shadow $loader-duration $loader-iteration-count linear;
      bottom: 0em;
      left: 0;
      height: .25em;
      width: 1em;
      border-radius: 50%;
      background-color: darken($body-bg, 45%);
      opacity: 0.3;
    }
  }
  
  .roller,
  .roller:last-child {
    width: 70px; 
    height: 70px; 
    position: absolute;
    top: 0;
    left: 0;
    animation: rollercoaster $loader-duration $loader-iteration-count linear;
    transform: rotate(135deg);
  }
  
  .roller:last-child {
    left: auto;
    right: 0;
    transform: rotate(-45deg);
    animation: rollercoaster2 $loader-duration $loader-iteration-count linear;
  }
  
  .roller:before,
  .roller:last-child:before {
    content:""; 
    display: block;
    width: 15px;
    height: 15px;
    background: rgb(0, 0, 128);
    border-radius: 50%;
  }
  
  @keyframes rollercoaster {
    0%    { transform: rotate(135deg);}
    8%    { transform: rotate(240deg);}
    20%   { transform: rotate(300deg);}
    40%   { transform: rotate(380deg);}
    45%   { transform: rotate(440deg);}
    50%   { transform: rotate(495deg); opacity: 1;}
    50.1% { transform: rotate(495deg); opacity: 0;}
    100%  { transform: rotate(495deg); opacity: 0;}
  }
  
  @keyframes rollercoaster2 {
    0%    { opacity: 0;}
    49.9% { opacity: 0;}
    50%   { opacity:1; transform: rotate(-45deg);}
    58%   { transform: rotate(-160deg);}
    70%   { transform: rotate(-240deg);}
    80%   { transform: rotate(-300deg);}
    90%   { transform: rotate(-340deg);}
    100%  { transform: rotate(-405deg);}
  }
  
  @keyframes shadow {
    0%   { opacity: .3; transform: translateX(65px) scale(0.5, 0.5);}
    8%   { transform: translateX(30px) scale(2, 2);}
    13%  { transform: translateX(0px) scale(1.3, 1.3);}
    30%  { transform: translateX(-15px) scale(0.5, 0.5); opacity: 0.1;}
    50%  { transform: translateX(60px) scale(1.2, 1.2); opacity: 0.3;}
    60%  { transform: translateX(130px) scale(2, 2); opacity: 0.05;}
    65%  { transform: translateX(145px) scale(1.2, 1.2);}
    80%  { transform: translateX(120px) scale(0.5, 0.5); opacity: 0.1;}
    90%  { transform: translateX(80px) scale(0.8, 0.8);}
    100% { transform: translateX(60px); opacity: 0.3;}
  }
  
  #loader2 {
    &:after {
      animation-delay: 0.15s;
    }
    
    .roller {
      animation-delay: 0.15s;
    }
  }
  
  #loader3 {
    &:after {
      animation-delay: 0.3s;
    }
    
    .roller {
      animation-delay: 0.3s;
    }
  }
  </style>
   -->
  <template>
    <div class="progress"></div>

  </template>
<style>
.progress {
  /* position: absolute;
  top: 15rem;
  left: 0; */
   height: 4.5px;
   width: 100%;
   /* background: linear-gradient(#474bff 0 0),
       linear-gradient(#474bff 0 0),
       #dbdcef; */
       background: linear-gradient(#7a42f4 0 0), /* Violet vif */
            linear-gradient(#7a42f4 0 0),
            #c3b7f0; /* Violet doux */

   background-size: 60% 100%;
   background-repeat: no-repeat;
   animation: progress-7x9cg2 2s infinite;
}

@keyframes progress-7x9cg2 {
   0% {
      background-position: -150% 0,-150% 0;
   }

   66% {
      background-position: 250% 0,-150% 0;
   }

   100% {
      background-position: 250% 0, 250% 0;
   }
}
</style>