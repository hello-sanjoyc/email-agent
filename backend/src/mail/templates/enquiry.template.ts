const enquiryTemplate = (data: {
    full_name: string;
    email: string;
    phone: string;
    company?: string;
    message: string;
    submittedAt: string;
}): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:40px 0;">
                <table width="600" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border-radius:8px;padding:40px;">
                    <tr>
                        <td>
                            <h2 style="color:#333333;margin-top:0;">📬 New Enquiry Received</h2>
                            <p style="color:#555555;line-height:1.6;">
                                A new enquiry has been submitted. Here are the details:
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0"
                                   style="background:#f9f9f9;border-radius:6px;padding:20px;margin:16px 0;">
                                <tr>
                                    <td style="padding:8px 0;border-bottom:1px solid #eeeeee;">
                                        <span style="color:#999999;font-size:12px;display:block;">FULL NAME</span>
                                        <span style="color:#333333;font-weight:bold;">${data.full_name}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;border-bottom:1px solid #eeeeee;">
                                        <span style="color:#999999;font-size:12px;display:block;">EMAIL</span>
                                        <a href="mailto:${data.email}" style="color:#4F46E5;font-weight:bold;text-decoration:none;">${data.email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;border-bottom:1px solid #eeeeee;">
                                        <span style="color:#999999;font-size:12px;display:block;">PHONE</span>
                                        <span style="color:#333333;font-weight:bold;">${data.phone}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;border-bottom:1px solid #eeeeee;">
                                        <span style="color:#999999;font-size:12px;display:block;">COMPANY</span>
                                        <span style="color:#333333;font-weight:bold;">${data.company?.trim() ? data.company : '—'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;">
                                        <span style="color:#999999;font-size:12px;display:block;">MESSAGE</span>
                                        <span style="color:#333333;line-height:1.6;">${data.message}</span>
                                    </td>
                                </tr>
                            </table>

                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;"/>
                            <p style="color:#999999;font-size:12px;">
                                Submitted at ${data.submittedAt}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export default enquiryTemplate;