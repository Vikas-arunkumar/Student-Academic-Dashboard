import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";
import { createPortal } from "react-dom";

export default function CustomDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isAlert = false
}) {
    // Only access document if in a browser environment
    const mountNode = typeof document !== "undefined" ? document.body : null;

    if (!mountNode) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="custom-dialog-overlay">
                    <motion.div
                        className="custom-dialog-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                    />
                    <motion.div
                        className="custom-dialog-card"
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: "spring", duration: 0.3 }}
                    >
                        <div className="custom-dialog-icon-header">
                            <AlertCircle className="dialog-warning-icon" size={28} />
                        </div>
                        <h2>{title}</h2>
                        <p>{message}</p>
                        <div className="custom-dialog-actions">
                            {!isAlert && (
                                <button className="secondary-action" onClick={onCancel}>
                                    {cancelText}
                                </button>
                            )}
                            <button className="danger-action" onClick={onConfirm}>
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        mountNode
    );
}
