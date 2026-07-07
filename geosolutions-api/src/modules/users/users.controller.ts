import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { ListUsersQuery, UpdateStatusInput } from './users.schema';

export class UsersController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await usersService.listUsers(req.query as unknown as ListUsersQuery);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getUserById(req.params.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request<{ id: string }, {}, UpdateStatusInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await usersService.updateStatus(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'User status updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      await usersService.deleteUser(req.params.id);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
