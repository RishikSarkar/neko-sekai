import { MdEdit } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';
import type { Task } from '@/types';

interface PetTasksPanelProps {
  tasks: Task[];
  currLevel: number;
  onTaskNameChange: (e: React.ChangeEvent<HTMLInputElement>, taskId: number) => void;
  onTaskBlur: (taskId: number) => void;
  onToggleTaskEdit: (taskId: number) => void;
  onCompleteTask: (taskId: number) => void;
  coinCurrentlyIncreasing: boolean;
  t: (key: string, values?: { level?: number }) => string;
}

export function PetTasksPanel({
  tasks,
  currLevel,
  onTaskNameChange,
  onTaskBlur,
  onToggleTaskEdit,
  onCompleteTask,
  coinCurrentlyIncreasing,
  t,
}: PetTasksPanelProps) {
  return (
    <div className="h-full max-h-[60vh] overflow-y-scroll col-span-1 bg-black/90 border-8 border-black mr-8 items-center justify-center text-black rounded-xl">
      <div className="h-full lg:px-4 px-1">
        <div className="lg:text-2xl text-md bg-white lg:py-2 py-1 lg:my-4 my-1 rounded-xl">{t('tasks')}</div>
        {tasks.map((task) => (
          <div key={task.id} className="grid grid-cols-5 lg:gap-2 gap-1">
            <div
              className={`${task.completed ? 'line-through bg-white/20 text-white' : 'bg-white/90'} col-span-4 lg:text-lg text-sm text-left lg:py-2 py-1 lg:px-2 px-1 lg:my-2 my-1 rounded-xl rounded-r-none flex items-center ease-in duration-100 lg:h-12 h-8 max-h-[10vh] overflow-auto`}
            >
              {task.editing ? (
                <input
                  type="text"
                  className="w-full bg-transparent lg:px-2 px-1 selection:text-white selection:bg-black focus:outline-none"
                  value={task.tempName}
                  onChange={(e) => onTaskNameChange(e, task.id)}
                  onBlur={() => onTaskBlur(task.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onTaskBlur(task.id); }}
                  autoFocus
                />
              ) : (
                <span className="lg:px-2 px-1">{task.name}</span>
              )}
            </div>
            <div
              onClick={() => {
                if (task.name === `task ${task.id}`) onToggleTaskEdit(task.id);
                else if (!task.completed && !coinCurrentlyIncreasing) onCompleteTask(task.id);
              }}
              className={`${task.completed ? 'bg-white/20 text-white' : 'bg-white hover:bg-white/80 cursor-pointer'} col-span-1 text-sm text-center lg:py-2 py-1 lg:px-4 px-1 lg:my-2 my-1 rounded-xl rounded-l-none flex items-center justify-center lg:h-12 h-8 ease-in duration-100`}
            >
              {task.name === `task ${task.id}` && !task.completed ? (
                <MdEdit size={15} />
              ) : task.completed ? (
                <FaCheck size={15} />
              ) : (
                `$${task.coins}`
              )}
            </div>
          </div>
        ))}
        <div className="text-white lg:text-sm text-xs py-1">{t('newTaskAtLevel', { level: currLevel + (currLevel % 2) + 1 })}</div>
      </div>
    </div>
  );
}
