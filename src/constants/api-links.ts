export const API_LINKS = {
  STABLESTAKING: {
    PARAMS: '/symphony/stablestaking/v1beta1/params',
    REWARD_AMOUNT_PER_POOL:
      '/symphony/stablestaking/v1beta1/reward_amount_per_pool',
    TOTAL_STAKERS: '/symphony/stablestaking/v1beta1/total_stakers',
    TOP_STAKERS: '/symphony/stablestaking/v1beta1/top_stakers',
    USER_TOTAL_STAKE: '/symphony/stablestaking/v1beta1/user_total_stake',
    STABLE_POOLS: '/symphony/stablestaking/v1beta1/stable_pools',
  },
  MARKET: {
    SWAP: '/symphony/market/v1beta1/swap',
  },
};

// Fallback REST endpoints for Symphony mainnet
// These will be tried in order if the default endpoint fails
export const SYMPHONY_REST_ENDPOINTS = [
  'https://api-symphony.sr20de.xyz',
  'https://api-main-symphony.vinjan.xyz',
  'https://symphony-api.cogwheel.zone',
  'https://symphony.api.nodeshub.online',
];
