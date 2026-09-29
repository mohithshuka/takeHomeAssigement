const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

describe('Task API', () => {
  describe('GET /tasks', () => {
    test('should return an empty array initially', async () => {
      const response = await request(app).get('/tasks');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    test('should return all tasks', async () => {
      await request(app)
        .post('/tasks')
        .send({ title: 'Task 1' });

      await request(app)
        .post('/tasks')
        .send({ title: 'Task 2' });

      const response = await request(app).get('/tasks');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test('should filter tasks by status', async () => {
      await request(app)
        .post('/tasks')
        .send({
          title: 'Todo task',
          status: 'todo',
        });

      await request(app)
        .post('/tasks')
        .send({
          title: 'Done task',
          status: 'done',
        });

      const response = await request(app)
        .get('/tasks?status=todo');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Todo task');
    });

    test('should paginate correctly', async () => {
      await request(app)
        .post('/tasks')
        .send({ title: 'Task 1', priority: 'low' });

      await request(app)
        .post('/tasks')
        .send({ title: 'Task 2', priority: 'medium' });

      await request(app)
        .post('/tasks')
        .send({ title: 'Task 3', priority: 'high' });

      const response = await request(app)
        .get('/tasks?page=1&limit=2');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Task 1');
      expect(response.body[1].title).toBe('Task 2');
    });
  });

  describe('POST /tasks', () => {
    test('should create a task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Write tests',
          description: 'Complete the assignment',
          priority: 'high',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Write tests');
      expect(response.body.description).toBe(
        'Complete the assignment'
      );
      expect(response.body.priority).toBe('high');
    });

    test('should reject a task without a title', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          description: 'Missing title',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject an invalid status', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Invalid status task',
          status: 'invalid_status',
        });

      expect(response.statusCode).toBe(400);
    });

    test('should reject an invalid priority', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Invalid priority task',
          priority: 'invalid_priority',
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /tasks/:id', () => {
    test('should update an existing task', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Original task',
        });

      const id = createResponse.body.id;

      const response = await request(app)
        .put(`/tasks/${id}`)
        .send({
          title: 'Updated task',
          priority: 'high',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe('Updated task');
      expect(response.body.priority).toBe('high');
    });

    test('should return 404 for unknown task', async () => {
      const response = await request(app)
        .put('/tasks/does-not-exist')
        .send({
          title: 'Updated',
        });

      expect(response.statusCode).toBe(404);
    });

    test('should reject invalid update data', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Task',
        });

      const id = createResponse.body.id;

      const response = await request(app)
        .put(`/tasks/${id}`)
        .send({
          status: 'invalid_status',
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('should delete an existing task', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Delete me',
        });

      const id = createResponse.body.id;

      const response = await request(app)
        .delete(`/tasks/${id}`);

      expect(response.statusCode).toBe(204);
    });

    test('should return 404 for unknown task', async () => {
      const response = await request(app)
        .delete('/tasks/does-not-exist');

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    test('should complete a task', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Complete me',
          priority: 'high',
        });

      const id = createResponse.body.id;

      const response = await request(app)
        .patch(`/tasks/${id}/complete`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('done');
      expect(response.body.completedAt).not.toBeNull();
    });

    test('should return 404 for unknown task', async () => {
      const response = await request(app)
        .patch('/tasks/does-not-exist/complete');

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /tasks/:id/assign', () => {
    test('should assign a task', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Assigned task',
          priority: 'high',
        });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .patch(`/tasks/${taskId}/assign`)
        .send({
          assignee: 'Mohith',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(taskId);
      expect(response.body.assignee).toBe('Mohith');
    });

    test('should reject empty assignee', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Task to assign',
        });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .patch(`/tasks/${taskId}/assign`)
        .send({
          assignee: '',
        });

      expect(response.statusCode).toBe(400);
    });

    test('should reject non-string assignee', async () => {
      const createResponse = await request(app)
        .post('/tasks')
        .send({
          title: 'Task to assign',
        });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .patch(`/tasks/${taskId}/assign`)
        .send({
          assignee: 123,
        });

      expect(response.statusCode).toBe(400);
    });

    test('should return 404 for unknown task', async () => {
      const response = await request(app)
        .patch('/tasks/does-not-exist/assign')
        .send({
          assignee: 'Mohith',
        });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /tasks/stats', () => {
    test('should return task statistics', async () => {
      await request(app)
        .post('/tasks')
        .send({
          title: 'Todo task',
          status: 'todo',
        });

      await request(app)
        .post('/tasks')
        .send({
          title: 'Progress task',
          status: 'in_progress',
        });

      await request(app)
        .post('/tasks')
        .send({
          title: 'Done task',
          status: 'done',
        });

      const response = await request(app)
        .get('/tasks/stats');

      expect(response.statusCode).toBe(200);
      expect(response.body.todo).toBe(1);
      expect(response.body.in_progress).toBe(1);
      expect(response.body.done).toBe(1);
      expect(response.body.overdue).toBe(0);
    });
  });
});