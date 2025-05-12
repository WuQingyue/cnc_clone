
<template>
    <div class="luxury-showcase">
        <div class="showcase-header">
            <h1 class="showcase-title">奢侈品金属件定制</h1>
            <p class="showcase-subtitle">采用高精度CNC技术，完美复刻各大品牌金属件，每一处细节都彰显精湛工艺</p>
        </div>

        <!-- 左滑 -->
        <div class="slider-track">
            <div class="slider-row left-to-right">
                <div v-for="(brand, index) in brands" :key="index" class="luxury-item"
                     @mouseenter="pauseAnimation($event)" @mouseleave="resumeAnimation($event)">
                    <div class="luxury-logo">
                        <img :src="brands_img[index]">
                    </div>
                    <div class="luxury-brand">{{ brand }}</div>
                </div>
                <!-- 复制一份元素用于循环 -->
                <div v-for="(brand, index) in brands" :key="index + brands.length" class="luxury-item"
                     @mouseenter="pauseAnimation($event)" @mouseleave="resumeAnimation($event)">
                    <div class="luxury-logo">
                        <img :src="brands_img[index]">
                    </div>
                    <div class="luxury-brand">{{ brand }}</div>
                </div>
            </div>
        </div>

        <!-- 右滑 -->
        <div class="slider-track">
            <div class="slider-row right-to-left">
                <div v-for="(brand, index) in bottomBrands" :key="index" class="luxury-item"
                     @mouseenter="pauseAnimation($event)" @mouseleave="resumeAnimation($event)" >
                    <div class="luxury-logo">
                        <img :src="brands_img[index % brands_img.length]">
                    </div>
                    <div class="luxury-brand">{{ brand }}</div>
                </div>
                <!-- 复制一份元素用于循环 -->
                <div v-for="(brand, index) in bottomBrands" :key="index + bottomBrands.length" class="luxury-item"
                     @mouseenter="pauseAnimation($event)" @mouseleave="resumeAnimation($event)">
                    <div class="luxury-logo">
                        <img :src="brands_img[index % brands_img.length]">
                    </div>
                    <div class="luxury-brand">{{ brand }}</div>
                </div>
            </div>
        </div>

        <div class="cta-section">
            <a href="#" class="cta-button">开始您的金属件定制</a>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const brands = ref([
    'VANSCACE', 'Givenchy', 'PRADA', 'Armani', 'Burberry',
    'HERMÈS', 'GUCCI', 'CHANEL','LV','Rolex','Dior'
]);
const brands_img = ref([
    require('@/assets/images/VANSACE.png'),
    require('@/assets/images/纪梵希.png'),
    require('@/assets/images/prada.png'),
    require('@/assets/images/阿玛尼.png'),
    require('@/assets/images/博柏利.png'),
    require('@/assets/images/hermes.png'),
    require('@/assets/images/gucci.png'),
    require('@/assets/images/chanel.png'),
    require('@/assets/images/lv.png'),
    require('@/assets/images/Rolex.jpg'),
    require('@/assets/images/dior.jpg')
]);

const bottomBrands = ref([
    'LOUIS VUITTON', 'CHANEL', 'DIOR', 'BURBERRY', 'SAINT LAURENT',
    'LOUIS VUITTON', 'CHANEL', 'DIOR'
]);

const pauseAnimation = (event) => {
    const row = event.currentTarget.closest('.slider-row');
    row.style.animationPlayState = 'paused';
};

const resumeAnimation = (event) => {
    const row = event.currentTarget.closest('.slider-row');
    row.style.animationPlayState = 'running';
};

const adjustAnimationSpeed = () => {
    const width = window.innerWidth;
    const speed = width > 768 ? 50 : 30; // 移动端速度稍慢

    const rows = document.querySelectorAll('.slider-row');
    rows.forEach(row => {
        row.style.animationDuration = `${speed}s`;
    });
};

onMounted(() => {
    window.addEventListener('resize', adjustAnimationSpeed);
    adjustAnimationSpeed(); // 初始化
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', adjustAnimationSpeed);
});
</script>

<style scoped>
:root {
    --gold: #d4af37;
    --silver: #c0c0c0;
    --spacing: 80px; /* 两行之间的间隔 */
}

body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background-color: #f9f6f2;
    color: #333;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

.luxury-showcase {
    max-width: 100vw;
    margin: 0 auto;
    padding: 80px 0;
    position: relative;
}

.showcase-header {
    text-align: center;
    margin-bottom: 60px;
    padding: 0 20px;
}

.showcase-title {
    font-weight: 300;
    letter-spacing: 6px;
    margin: 0 0 20px;
    font-size: 2.8rem;
    position: relative;
    display: inline-block;
    color: #222;
}

.showcase-title:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: var(--gold);
}

.showcase-subtitle {
    color: #777;
    letter-spacing: 2px;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.8;
    font-size: 1.1rem;
}

.slider-track {
    display: flex;
    position: relative;
    height: 280px; /* 单行高度 */
    margin: var(--spacing) 0;
    align-items: center;
    overflow: hidden;
}

.slider-row {
    display: flex;
    position: absolute;
    height: 100%;
    align-items: center;
    gap: 40px;
    will-change: transform;
}
.slider-row.left-to-right {
    animation: slideLeft 50s linear infinite;
    /* 修改初始位置 */
    transform: translateX(0); 
}

.slider-row.right-to-left {
    animation: slideRight 50s linear infinite;
    /* 初始位置在右边 */
    transform: translateX(0); 
}

@keyframes slideLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

@keyframes slideRight {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
}
.luxury-item {
    width: 320px;
    height: 240px;
    background: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;
    padding: 20px;
}

.luxury-item:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0,0,0,0.12);
}

/* 金属光泽效果 */
.luxury-item:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
            to right,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0) 100%
    );
    transform: skewX(-25deg);
    transition: all 0.8s ease;
}

.luxury-item:hover:before {
    left: 150%;
}

.luxury-logo {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.luxury-logo img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    filter: grayscale(20%) drop-shadow(0 5px 10px rgba(0,0,0,0.1));
    transition: all 0.4s ease;
}

.luxury-item:hover .luxury-logo img {
    filter: grayscale(0%) drop-shadow(0 10px 15px rgba(212, 175, 55, 0.2));
    transform: scale(1.08);
}

.luxury-brand {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 18px;
    letter-spacing: 2px;
    color: #222;
    position: relative;
    width: 100%;
}

.luxury-brand:after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 1px;
    background: var(--gold);
    opacity: 0;
    transition: all 0.4s ease;
}

.luxury-item:hover .luxury-brand:after {
    opacity: 1;
    width: 80px;
}

.cta-section {
    text-align: center;
    margin-top: 100px;
    padding: 0 20px;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    padding: 16px 40px;
    background: #111;
    color: white;
    text-decoration: none;
    letter-spacing: 3px;
    font-size: 16px;
    border-radius: 50px;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
}

.cta-button:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.2),
            transparent
    );
    transition: all 0.6s ease;
}

.cta-button:hover {
    background: #000;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.cta-button:hover:before {
    left: 100%;
}

@media (max-width: 1024px) {
    .luxury-item {
        width: 280px;
        height: 210px;
    }

    .slider-track {
        height: 240px;
    }
}

@media (max-width: 768px) {
    .showcase-title {
        font-size: 2rem;
        letter-spacing: 3px;
    }

    .showcase-subtitle {
        font-size: 1rem;
    }

    .luxury-item {
        width: 240px;
        height: 180px;
    }

    .slider-track {
        height: 200px;
        margin: 50px 0;
    }

    .luxury-brand {
        font-size: 16px;
    }
}
</style>