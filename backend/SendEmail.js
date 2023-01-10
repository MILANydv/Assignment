// import { createTransport } from "nodemailer";

// export default async (email, subject, text) => {
// 	try {
// 		const transporter = createTransport({
// 			host:"smtp.mailtrap.io",
// 			service: process.env.SERVICE,
// 			port: 2525,
// 			secure: Boolean(process.env.SECURE),
// 			auth: {
// 				user: "c100c21ac69ff7",
// 				pass: "4f0eb32a4ae24d",
// 			},
// 		});

// 		await transporter.sendMail({
// 			from: "c100c21ac69ff7",
// 			to: email,
// 			subject: subject,
// 			text: text,
// 		});
// 		console.log("email sent successfully");
// 	} catch (error) {
// 		console.log("email not sent!");
// 		console.log(error);
// 		return error;
// 	}
// };