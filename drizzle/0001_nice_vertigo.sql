CREATE TABLE `salary_predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`occupation` varchar(100) NOT NULL,
	`age` int NOT NULL,
	`gender` varchar(20) NOT NULL,
	`education` varchar(100) NOT NULL,
	`yearsOfExperience` int NOT NULL,
	`currentSalary` int NOT NULL,
	`predictedSalary10Years` int NOT NULL,
	`confidenceScore` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salary_predictions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `salary_predictions` ADD CONSTRAINT `salary_predictions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;