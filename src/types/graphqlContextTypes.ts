import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthenticatedUser } from "./authTypes";

export interface GraphQLContext {
    req: Request;
    res: Response;
    prisma: PrismaClient;
    user: AuthenticatedUser | null;
    _operationName?: string | null;
    _operationType?: 'query' | 'mutation' | 'subscription';
    _isPublic?: boolean;
  }