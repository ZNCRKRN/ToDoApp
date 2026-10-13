import { memo } from "react";
import { Link } from "react-router-dom";

const PRIORITY_LABEL = { Low: "Düşük", Medium: "Orta", High: "Yüksek" };
const PRIORITY_NUM_LABEL = { 0: "Düşük", 1: "Orta", 2: "Yüksek" };
const PRIORITY_NUM_CLASS = { 0: "low", 1: "medium", 2: "high" };

function priorityMeta(priority) {
  if (typeof priority === "number") {
    return { label: PRIORITY_NUM_LABEL[priority] ?? "Orta", cls: PRIORITY_NUM_CLASS[priority] ?? "medium" };
  }
  return { label: PRIORITY_LABEL[priority] ?? "Orta", cls: (priority || "medium").toLowerCase() };
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
}

function TaskItem({ task, onToggle, onDelete }) {
  const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date(new Date().toDateString());
  const { label: priorityLabel, cls: priorityCls } = priorityMeta(task.priority);

  return (
    <li className={`task-item ${task.isCompleted ? "task-item--done" : ""}`}>
      <label className="task-item__checkbox">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
        />
        <span className="checkmark" />
      </label>

      <div className="task-item__body">
        <div className="task-item__title-row">
          <p className="task-item__title">{task.title}</p>
          <span className={`badge badge--${priorityCls}`}>{priorityLabel}</span>
          {task.category && <span className="badge badge--category">{task.category}</span>}
        </div>
        {task.description && <p className="task-item__desc">{task.description}</p>}
        <span className={`task-item__date ${isOverdue ? "task-item__date--overdue" : ""}`}>
          Son tarih: {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="task-item__actions">
        <Link to={`/tasks/${task.id}/edit`} className="btn btn--ghost">
          Düzenle
        </Link>
        <button className="btn btn--danger" onClick={() => onDelete(task.id)}>
          Sil
        </button>
      </div>
    </li>
  );
}

export default memo(TaskItem);
