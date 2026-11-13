import heroAlpine from '../assets/images/hero_alpine_dawn_1794555844073.jpg';
import destNepal from '../assets/images/dest_nepal_pokhara_1794555844835.jpg';
import destBali from '../assets/images/dest_bali_coast_1794555844337.jpg';
import destSwiss from '../assets/images/dest_swiss_alps_1794555845068.jpg';
import destJapan from '../assets/images/dest_kyoto_japan_1794555846047.jpg';
import destItaly from '../assets/images/dest_amalfi_italy_1794555845270.jpg';
import boutiqueVilla from '../assets/images/stay_boutique_villa_1794555846495.jpg';
import type { MediaKey } from '../types/travel';

export const MEDIA_ASSETS: Record<MediaKey, string> = {
  hero_alpine: heroAlpine,
  nepal: destNepal,
  bali: destBali,
  switzerland: destSwiss,
  japan: destJapan,
  italy: destItaly,
  boutique_villa: boutiqueVilla,
};

export function getMediaUrl(key?: string): string {
  if (key && key in MEDIA_ASSETS) {
    return MEDIA_ASSETS[key as MediaKey];
  }
  return heroAlpine;
}
