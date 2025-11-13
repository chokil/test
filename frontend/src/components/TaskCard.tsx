import { useState } from 'react';
import { Task, useTaskStore } from '../store/taskStore';
import { Calendar, Trash2, Edit, Flag } from 'lucide-react';
import { format } from 'date-fns';
import TaskModal from './TaskModal';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { deleteTask, updateTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      alert('Failed to delete task');
      setDeleting(false);
    }
  };

  const statusColors = {
    todo: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'in-progress': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    done: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  };

  return (
    <>
      <div className={`card hover:shadow-lg transition-all ${deleting ? 'opacity-50' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}
          >
            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              disabled={deleting}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded"
              disabled={deleting}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">{task.title}</h3>

        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          <div className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
            <Flag size={14} />
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
      />
    </>
  );
}
