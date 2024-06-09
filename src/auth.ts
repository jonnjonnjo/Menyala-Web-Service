import { createClient } from '@supabase/supabase-js';
import { prisma } from '../app';
import { Request, Response, NextFunction } from 'express';

export const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function register(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		return {
			error,
		};
	}

	return { data };
}

export async function login(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return {
			error,
		};
	}

	return { data };
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
	const { access_token, refresh_token } = req.cookies;

	if (!access_token || !refresh_token) {
		res.send(401).json({
			error: 'Unauthorized - No Access Token',
		});
	}

	try {
		const { data, error } = await supabase.auth.setSession({
			access_token: access_token,
			refresh_token: refresh_token,
		});

		if (error) {
			res.status(401).json({
				error: error,
				access_token,
			});
		} else {
			next();
		}
	} catch (err) {
		res.status(401).json({
			error: err,
		});
	}
}
