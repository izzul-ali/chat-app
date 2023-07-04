import { motion } from 'framer-motion';
import { CgSpinner } from 'react-icons/cg';

export default function LoadingSpinner() {
  return (
    <motion.div
      key="loading"
      layoutId="spinnerr"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-fit m-auto left-0 right-0 absolute bg-white dark:bg-gray-900 p-1 rounded-full"
    >
      <CgSpinner className="text-3xl text-blue-600 animate-spin" />
    </motion.div>
  );
}
