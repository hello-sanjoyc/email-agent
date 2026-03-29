const subscriptionHaltedTemplate = (
    userName: string, 
    planName: string, 
    razorpayBillingUrl: string
): string => `
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
                       style="background:#ffffff;border-radius:8px;padding:40px;border:1px solid #fee2e2;">
                    <tr>
                        <td>
                            <h2 style="color:#dc2626;margin-top:0;">Action Required: Payment Failed</h2>
                            <p style="color:#555555;line-height:1.6;">
                                Hi <strong>${userName}</strong>,
                            </p>
                            <p style="color:#555555;line-height:1.6;">
                                We were unable to process the recurring payment for your <strong>${planName}</strong> subscription. To avoid any further interruption to your email automation, a quick update is needed.
                            </p>
                            
                            <div style="background-color:#fff1f2; border-left:4px solid #dc2626; border-radius:4px; padding:16px; margin:24px 0;">
                                <p style="color:#991b1b; font-size:14px; margin:0;">
                                    <strong>Status:</strong> Your automation and premium features are currently paused.
                                </p>
                            </div>

                            <p style="color:#555555;line-height:1.6;">
                                You can restore your service instantly by updating your payment method via our secure billing portal below:
                            </p>
                            
                            <a href="${razorpayBillingUrl}" 
                               style="display:inline-block;padding:12px 24px;
                                      background-color:#dc2626;color:#ffffff;
                                      text-decoration:none;border-radius:6px;
                                      font-weight:bold;margin:16px 0;">
                                Update Payment & Restore Access
                            </a>

                            <p style="color:#777777; font-size:13px; line-height:1.6;">
                                Once the payment is successful, your account usage limits will be refreshed and your automation will resume automatically.
                            </p>

                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;"/>
                            <p style="color:#999999;font-size:12px;">
                                If you have already updated your payment details, please ignore this email. For any other assistance, reply to this email to reach our support team.
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

export default subscriptionHaltedTemplate;