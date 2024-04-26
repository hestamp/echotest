import { toast } from 'react-hot-toast';

export const errorToast = (message) => toast.error(message);

export const noteToast = (message, durex) =>
  toast(`${message || 'message'}`, {
    icon: '👏',
    duration: durex || 1000,
  });

export const successToast = (message) => {
  return toast.success(message);
};

export const customToast = (content) =>
  toast.custom((t) => (
    <div className="toast-custom">
      <div className="toastblock">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img className="h-10 w-10 rounded-full" src="" alt="" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Emilia Gates</p>
            <p className="mt-1 text-sm text-gray-500">
              Sure! 8:30pm works great!
            </p>
          </div>
        </div>
      </div>
      <div className="toastclose">
        {content}
        <button onClick={() => toast.dismiss(t.id)} className="toastclosebutt">
          Close
        </button>
      </div>
    </div>
  ));
