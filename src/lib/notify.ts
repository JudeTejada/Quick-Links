import { toastManager } from '../components/ui/toast';

type NotifyOptions = {
  status: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  description?: string;
};

const statusMap = {
  success: 'success',
  danger: 'error',
  warning: 'warning',
  info: 'info',
} as const;

export function notify({ status, title, description }: NotifyOptions) {
  toastManager.add({
    title,
    description,
    type: statusMap[status],
  });
}
