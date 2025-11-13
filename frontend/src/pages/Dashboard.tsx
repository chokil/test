import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Header from '../components/Header';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, loading } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what you need to do today
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400">To Do</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">{stats.todo}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">{stats.inProgress}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400">Done</div>
            <div className="text-2xl font-bold mt-1 text-green-600">{stats.done}</div>
          </div>
        </div>

        {/* Filters and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'todo', 'in-progress', 'done'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>

        {/* Tasks */}
        {loading && tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
