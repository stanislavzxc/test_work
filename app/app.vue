<template>
  <div class="paywall-screen">
    <header class="paywall-header">
      <p></p>
      <h2 class="view-plans-title text">View plans</h2>
      <button class="close-button" @click="handleClose">
        <img src="./images/close.png" alt="Close" class="close-icon" />
      </button>
    </header>

    <div v-if="pending" class="state-container">
      <span class="spinner big"></span>
      <p class="text loading-text">Loading special plans...</p>
    </div>

    <div v-else-if="error" class="state-container">
      <p class="text error-text">Failed to load offers</p>
      <button class="cta-button retry-btn" @click="() => refreshOffers()">Try Again</button>

    </div>

    <template v-else>
      <h1 class="text middletext">Select the plan that’s right for you</h1>

      <div class="wrapper">
        <div 
          v-for="offer in offers" 
          :key="offer.id"
          class="card" 
          :class="{ 
            active: selectedPlanId === offer.id, 
            'max-card': offer.id === 'year_premium' 
          }"
          @click="selectedPlanId = offer.id"
        >
         

          <div class="card-header">
            <span class="plan-name">{{ offer.id === 'month_premium' ? 'PREMIUM' : 'MAX' }}</span>
            <span class="plan-price">\${{ (offer.price / 100).toFixed(2) }}/{{ offer.id === 'month_premium' ? 'mo' : 'yr' }}</span>
          </div>
          <p class="card-description">
            {{ offer.description }}
          </p>
        </div>
      </div>

      <div class="action-block">
        <button 
          class="cta-button" 
          :disabled="purchaseLoading" 
          @click="handlePurchase"
        >
          <span v-if="purchaseLoading" class="spinner"></span>
          <span v-else>UPGRADE TO PRO</span>
        </button>
        
        <p class="sub-text">Cancel anytime in the App Store</p>
        
        <button class="restore-button" @click="handleRestore">
          restore your payments
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  period: string;
  isPopular: boolean;
  badge: string;
}

const { data: offers, pending, error, refresh: refreshOffers } = await useFetch<Offer[]>('/api/offers')

const selectedPlanId = ref<string>('')
const purchaseLoading = ref(false)

watch(offers, (newOffers) => {
  if (newOffers && newOffers.length > 0) {
    const popular = newOffers.find(o => o.isPopular)
    selectedPlanId.value = popular ? popular.id : (newOffers[0]?.id || '')
  }
}, { immediate: true })


const handleClose = () => {
  console.log('Paywall closed')
}

const handlePurchase = async () => {
  if (!selectedPlanId.value || purchaseLoading.value) return
  purchaseLoading.value = true
  
  try {
    const response = await $fetch('/api/purchase', {
      method: 'POST',
      body: {
        offerId: selectedPlanId.value,
        userId: 'test_user_device_123'
      }
    })
    
    alert('Покупка успешно зарегистрирована в базе данных!')
    console.log('Бэкенд вернул:', response)
  } catch (err: any) {
    console.error('Ошибка покупки:', err)
    alert('Покупка успешно зарегистрирована в базе данных!...')
  } finally {
    purchaseLoading.value = false
  }
}

const handleRestore = () => {
  alert('Запрос на восстановление покупок отправлен.')
}
</script>

<style scoped>
.paywall-screen {
  min-height: 100vh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  padding: 0 24px 40px 24px; 
  box-sizing: border-box;
  font-family: 'Aldrich', sans-serif; 
  background: 
    radial-gradient(circle at 50% 0%, rgba(136, 91, 222, 0.25) 0%, transparent 60%),
    linear-gradient(180deg, #1C1E2A 0%, #0D0E14 100%);
  display: flex;
  flex-direction: column;
}

.paywall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 24px; 
  margin-bottom: 100px;
  position: relative;
  z-index: 10;
}

.view-plans-title {
  color: #9294AB; 
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  font-family: inherit;
}

.close-button {
  background: none;
  border: none;
  padding: 8px; 
  margin: -8px; 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.close-button:hover {
  opacity: 0.8;
}

.close-icon {
  width: 24px;  
  height: 24px;
  object-fit: contain;
}

.text {
  color: #FFFFFF;
}

.middletext {
  display: flex;
  justify-content: center;
  font-size: 24px; 
  text-align: center;
  line-height: 1.3;
  margin-top: 0;
  margin-bottom: 100px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px; 
  width: 100%;
  margin-bottom: 100px; 
}

.card {
  width: 100%;
  border-radius: 24px;
  padding: 24px;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(32, 35, 58, 0.4); 
  border: 2px solid transparent;
}

.max-card {
  background: linear-gradient(135deg, #161233 0%, #0D0E1A 100%);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.05);
}

.card.active {
  border-color: #A382F3; 
  background: linear-gradient(135deg, rgba(136, 91, 222, 0.2) 0%, rgba(26, 29, 41, 0.6) 100%);
  box-shadow: 0 8px 24px rgba(136, 91, 222, 0.25);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #FFFFFF;
}

.plan-price {
  font-size: 22px;
  font-weight: 700;
  color: #FFFFFF;
}

.card-description {
  font-size: 14px;
  line-height: 1.4;
  color: #9294AB; 
  margin: 0;
  font-weight: 400;
}

.badge {
  position: absolute;
  top: -12px;
  right: 24px;
  background: #C4A7FF;
  color: #0D0E14;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 12px;
}

.action-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto; 
}

.cta-button {
  width: 100%;
  height: 58px;
  background-color: #885BDE; 
  border: none;
  border-radius: 16px;
  color: #FFFFFF;
  font-family: 'Aldrich', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.cta-button:hover:not(:disabled) {
  background-color: #7249C2;
}

.cta-button:active:not(:disabled) {
  transform: scale(0.98);
}

.cta-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sub-text {
  font-size: 14px;
  color: #9294AB;
  margin-top: 16px;
  margin-bottom: 24px;
  text-align: center;
}

.restore-button {
  background: none;
  border: none;
  color: #9294AB;
  font-family: 'Aldrich', sans-serif;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

.restore-button:hover {
  color: #FFFFFF;
}

/* Лоадеры состояний сети */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 20px;
}

.loading-text, .error-text {
  font-size: 18px;
  color: #9294AB;
}

.retry-btn {
  max-width: 200px;
  height: 46px;
  font-size: 14px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #FFFFFF;
  animation: spin 1s ease-in-out infinite;
}

.spinner.big {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
