import { getResourcePrice, getInitData } from '@/api/platform';
import type { Response as resourcePriceResponse } from '@/pages/api/platform/resourcePrice';

export let SEALOS_DOMAIN = 'cloud.sealos.io';
export let INGRESS_SECRET = 'wildcard-cert';

export const loadInitData = async () => {
  try {
    const res = await getInitData();
    SEALOS_DOMAIN = res.SEALOS_DOMAIN;
    INGRESS_SECRET = res.INGRESS_SECRET;
    console.log(res);
  } catch (error) {}
  return {
    SEALOS_DOMAIN,
    INGRESS_SECRET
  };
};

export let SOURCE_PRICE: resourcePriceResponse = {
  cpu: 0.067,
  memory: 0.033792,
  storage: 0.002048
};
export let INSTALL_ACCOUNT = false;

let retryGetPrice = 3;
export const getUserPrice = async () => {
  try {
    const res = await getResourcePrice();
    SOURCE_PRICE = res;
    INSTALL_ACCOUNT = true;
  } catch (err) {
    retryGetPrice--;
    if (retryGetPrice >= 0) {
      setTimeout(() => {
        getUserPrice();
      }, 1000);
    }
  }
};
