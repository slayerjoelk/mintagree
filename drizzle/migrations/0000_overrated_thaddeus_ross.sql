CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`receipt_id` text NOT NULL,
	`filename` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` text,
	`scheduled_at` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`company` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_user_email_idx` ON `clients` (`user_id`,`email`);--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`subject` text NOT NULL,
	`bullets` text NOT NULL,
	`amount` real,
	`currency` text DEFAULT 'USD',
	`due_date` text,
	`client_email` text,
	`client_name` text,
	`require_otp` integer DEFAULT true,
	`otp` text,
	`status` text DEFAULT 'sent',
	`scheduled_at` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `receipts_token_unique` ON `receipts` (`token`);--> statement-breakpoint
CREATE TABLE `signatures` (
	`id` text PRIMARY KEY NOT NULL,
	`receipt_id` text NOT NULL,
	`client_email` text NOT NULL,
	`client_name` text,
	`action` text NOT NULL,
	`otp_used` text,
	`ip` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`subject` text,
	`bullets` text NOT NULL,
	`amount` real,
	`industry` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`company` text,
	`plan` text DEFAULT 'free',
	`email_verified` integer DEFAULT false,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);