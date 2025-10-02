// Use the global URLSearchParams (Edge/runtime-safe)

export async function checkBlock({ userId, ip, service }: { userId?: string, ip?: string, service: string }) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (ip) params.append('ip', ip);
    params.append('service', service);

    const res = await fetch(`/api/v1/auth/block/check?${params.toString()}`);
    if (!res.ok) throw new Error('Block check failed');
    return res.json();
}

export async function blockUserByIp({
    userId,
    ip,
    reason,
    service,
    status = 'active',
    expiresAt = null,
    blockedBy
}: {
    userId?: string;
    ip: string;
    reason: string;
    service: string;
    status?: 'active' | 'expired' | 'permanent';
    expiresAt?: Date | null;
    blockedBy: string;
}) {
    const payload = {
        userId,
        ip,
        reason,
        services: [service],
        status,
        expiresAt,
        blockedBy,
    };
    console.log('[blockUserByIp] Sending payload:', payload);
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/v1/auth/block/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const responseText = await res.text();
    console.log('[blockUserByIp] Response status:', res.status, 'Response body:', responseText);
    if (!res.ok) throw new Error('Block add failed: ' + responseText);
    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
}

// BlockRequest type for reference
// type BlockRequest = {
//     userId?: string;
//     ip?: string;
//     fingerprintId?: string;
//     userAgent?: string;
//     deviceInfo?: any;
//     reason: string;
//     services: string[];
//     status: 'active' | 'expired' | 'permanent';
//     expiresAt?: Date | null;
//     blockedBy: string;
// };