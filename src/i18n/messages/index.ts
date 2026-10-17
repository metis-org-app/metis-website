import type { Lang } from '../detect';
import { en, type Messages } from './en';
import { es } from './es';

export const MESSAGES: Record<Lang, Messages> = { en, es };
