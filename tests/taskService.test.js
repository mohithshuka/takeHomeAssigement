const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

describe('taskService', () => {
  describe('create()', () => {
    test('should create a task with default values', () => {
      const task = taskService.create({
        title: 'Test task',
      });

      expect(task).toHaveProperty('id');
      expect(task.title).toBe('Test task');
      expect(task.description).toBe('');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('medium');
      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
      expect(task).toHaveProperty('createdAt');
    });

    test('should create a task with provided values', () => {
      const task = taskService.create({
        title: 'Important task',
        description: 'Test description',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-10-01',
      });

      expect(task.title).toBe('Important task');
      expect(task.description).toBe('Test description');
      expect(task.status).toBe('in_progress');
      expect(task.priority).toBe('high');
      expect(task.dueDate).toBe('2026-10-01');
    });
  });

  describe('getAll()', () => {
    test('should return all tasks', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });

      const tasks = taskService.getAll();

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].title).toBe('Task 2');
    });

    test('should return an empty array when there are no tasks', () => {
      expect(taskService.getAll()).toEqual([]);
    });
  });

  describe('findById()', () => {
    test('should find a task by id', () => {
      const task = taskService.create({
        title: 'Find me',
      });

      const result = taskService.findById(task.id);

      expect(result).toEqual(task);
    });

    test('should return undefined for an unknown id', () => {
      expect(
        taskService.findById('does-not-exist')
      ).toBeUndefined();
    });
  });

  describe('getByStatus()', () => {
    test('should return tasks matching status', () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'Done task',
        status: 'done',
      });

      const result = taskService.getByStatus('todo');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Todo task');
    });
  });

  describe('getPaginated()', () => {
    test('should return the correct page', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });
      taskService.create({ title: 'Task 3' });

      const result = taskService.getPaginated(1, 2);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Task 1');
      expect(result[1].title).toBe('Task 2');
    });

    test('should return the second page correctly', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });
      taskService.create({ title: 'Task 3' });

      const result = taskService.getPaginated(2, 2);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Task 3');
    });
  });

  describe('update()', () => {
    test('should update an existing task', () => {
      const task = taskService.create({
        title: 'Original title',
      });

      const updated = taskService.update(task.id, {
        title: 'Updated title',
        priority: 'high',
      });

      expect(updated.title).toBe('Updated title');
      expect(updated.priority).toBe('high');
      expect(updated.id).toBe(task.id);
    });

    test('should return null for an unknown id', () => {
      const result = taskService.update(
        'does-not-exist',
        { title: 'Updated' }
      );

      expect(result).toBeNull();
    });
  });

  describe('remove()', () => {
    test('should remove an existing task', () => {
      const task = taskService.create({
        title: 'Delete me',
      });

      const result = taskService.remove(task.id);

      expect(result).toBe(true);
      expect(taskService.findById(task.id)).toBeUndefined();
    });

    test('should return false for an unknown id', () => {
      expect(
        taskService.remove('does-not-exist')
      ).toBe(false);
    });
  });

  describe('completeTask()', () => {
    test('should mark a task as done', () => {
      const task = taskService.create({
        title: 'Complete me',
        status: 'in_progress',
        priority: 'high',
      });

      const completed = taskService.completeTask(task.id);

      expect(completed.status).toBe('done');
      expect(completed.priority).toBe('medium');
      expect(completed.completedAt).not.toBeNull();
    });

    test('should return null for an unknown id', () => {
      expect(
        taskService.completeTask('does-not-exist')
      ).toBeNull();
    });
  });

  describe('assignTask()', () => {
    test('should assign a task', () => {
      const task = taskService.create({
        title: 'Assign me',
      });

      const updated = taskService.assignTask(
        task.id,
        'Mohith'
      );

      expect(updated.assignee).toBe('Mohith');
      expect(updated.id).toBe(task.id);
    });

    test('should return null for an unknown id', () => {
      expect(
        taskService.assignTask(
          'does-not-exist',
          'Mohith'
        )
      ).toBeNull();
    });
  });

  describe('getStats()', () => {
    test('should return correct task statistics', () => {
      taskService.create({
        title: 'Todo',
        status: 'todo',
      });

      taskService.create({
        title: 'Progress',
        status: 'in_progress',
      });

      taskService.create({
        title: 'Done',
        status: 'done',
      });

      const stats = taskService.getStats();

      expect(stats.todo).toBe(1);
      expect(stats.in_progress).toBe(1);
      expect(stats.done).toBe(1);
      expect(stats.overdue).toBe(0);
    });
  });

  describe('_reset()', () => {
    test('should clear all tasks', () => {
      taskService.create({
        title: 'Task 1',
      });

      taskService.create({
        title: 'Task 2',
      });

      taskService._reset();

      expect(taskService.getAll()).toEqual([]);
    });
  });
});