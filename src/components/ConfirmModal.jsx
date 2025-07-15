import { AnimatePresence, motion } from 'framer-motion';

/**
 * ConfirmModal
 *
 * props:
 *   open      — boolean
 *   item      — { id, name, price, image_url, description }
 *   onConfirm — (itemId) => void
 *   onClose   — () => void
 */
function ConfirmModal({ open, item, onConfirm, onClose }) {
  if (!open || !item) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          exit={{   scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md space-y-4 cursor-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* картинка помещается целиком */}
          <img
            src={item.image_url || '/placeholder.png'}
            alt={item.name}
            className="w-full max-h-60 object-contain rounded-md"
          />

          <h3 className="text-2xl font-bold">{item.name}</h3>
          <p className="text-purple-400">{item.price} ScamCoin</p>

          {item.description && (
            <p className="text-sm text-zinc-400 whitespace-pre-wrap">
              {item.description}
            </p>
          )}

          <div className="flex justify-end gap-4 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded"
            >
              Отмена
            </button>
            <button
              onClick={() => { onConfirm(item.id); onClose(); }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
            >
              Купить
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConfirmModal;
