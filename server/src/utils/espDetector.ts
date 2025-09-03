export function detectESP(opts: {
    headerMap: Map<string, string | string[]>;
    receivedRaw: string[];
    rawHeaders: string;
  }): string {
    const { headerMap, receivedRaw, rawHeaders } = opts;
  
    const hay = [
      rawHeaders,
      ...receivedRaw,
      ...Array.from(headerMap.keys()).map((k) => `${k}: ${headerMap.get(k)}`)
    ]
      .join('\n')
      .toLowerCase();
  
    // Common X-headers or domains
    const checks: Array<{ name: string; patterns: RegExp[] }> = [
      {
        name: 'Amazon SES',
        patterns: [/amazonses\.com/, /x-ses[-]/, /ses[-]/]
      },
      {
        name: 'Mailgun',
        patterns: [/mailgun\.org/, /x-mailgun/i, /mg\./]
      },
      {
        name: 'SendGrid',
        patterns: [/sendgrid\.net/, /x-sg[-]/]
      },
      {
        name: 'Postmark',
        patterns: [/postmarkapp\.com/, /x-pm[-]/]
      },
      {
        name: 'SparkPost',
        patterns: [/sparkpostmail\.com/, /x-msys[-]/, /sparkpost/]
      },
      {
        name: 'Brevo (Sendinblue)',
        patterns: [/sendinblue\.com/, /brevo/, /sib[\.-]/]
      },
      {
        name: 'HubSpot',
        patterns: [/hubspotemail\.net/, /hs[-]/]
      },
      {
        name: 'Gmail/Google',
        patterns: [/gmail\.com/, /mx\.google\.com/, /googlemail\.com/]
      },
      {
        name: 'Outlook/Microsoft 365',
        patterns: [/outlook\.com/, /protection\.outlook\.com/, /microsoft/]
      },
      {
        name: 'Zoho Mail',
        patterns: [/zoho\.com/, /zohomail/]
      }
    ];
  
    for (const c of checks) {
      if (c.patterns.some((re) => re.test(hay))) return c.name;
    }
  
    // Look at List-Unsubscribe or tracking domains
    const listUnsub = (headerMap.get('list-unsubscribe') || '') as string;
    if (typeof listUnsub === 'string' && /hubspotemail\.net/i.test(listUnsub)) return 'HubSpot';
  
    // Fallback
    return 'Unknown';
  }
  