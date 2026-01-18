import React from 'react';
import { motion } from 'framer-motion';

export default function ThankYou() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6 lowercase font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md space-y-8"
            >
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl"
                >
                    ❤️
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-bold text-text-primary"
                    >
                        thank you.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-text-secondary"
                    >
                        your details have been added to the book.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="pt-12 text-sm text-gray-400"
                >
                    you can close this tab now.
                </motion.div>
            </motion.div>
        </div>
    );
}
