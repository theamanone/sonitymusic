// lib/getUserDetails.ts
import { connectToVeliessaDb } from "@/lib/veliessa.db";
import { ObjectId } from 'mongodb';

interface UserDetails {
  _id: string;
  name: string;
  avatar?: string;
  email?: string;
  role?: string;
  theme?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  membershipCard?: any;
  createdAt?: Date;
}

export async function getUserDetails(userId: string): Promise<UserDetails | undefined> { // Changed from null to undefined
  try {
    const db = await connectToVeliessaDb();
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          _id: 1,
          name: 1,
          avatar: 1,
          role: 1,
          theme: 1,
          emailVerified: 1,
          twoFactorEnabled: 1,
          membershipCard: 1,
          createdAt: 1,
        }
      }
    );

    if (!user) return undefined; // Changed from null to undefined

    return {
      _id: user._id.toString(),
      name: user.name || 'Anonymous User',
      avatar: user.avatar || '',
      role: user.role || 'user',
      theme: user.theme || 'system',
      emailVerified: user.emailVerified || false,
      twoFactorEnabled: user.twoFactorEnabled || false,
      membershipCard: user.membershipCard ? JSON.parse(JSON.stringify(user.membershipCard)) : null,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    return undefined; // Changed from null to undefined
  }
}

export async function getUsersDetails(userIds: string[]): Promise<Map<string, UserDetails>> {
  try {
    const db = await connectToVeliessaDb();
    
    // Filter only valid 24-char hex ObjectId strings to avoid BSON errors
    const validIds = (userIds || []).filter(
      (id): id is string => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id)
    );

    if (validIds.length === 0) {
      return new Map();
    }

    const users = await db.collection('users').find(
      { _id: { $in: validIds.map(id => new ObjectId(id)) } },
      {
        projection: {
          _id: 1,
          name: 1,
          avatar: 1,
          role: 1,
          theme: 1,
          emailVerified: 1,
          twoFactorEnabled: 1,
          membershipCard: 1,
          createdAt: 1,
        }
      }
    ).toArray();

    const userMap = new Map<string, UserDetails>();
    
    users.forEach(user => {
      userMap.set(user._id.toString(), {
        _id: user._id.toString(),
        name: user.name || 'Anonymous User',
        avatar: user.avatar || '',
        role: user.role || 'user',
        theme: user.theme || 'system',
        emailVerified: user.emailVerified || false,
        twoFactorEnabled: user.twoFactorEnabled || false,
        membershipCard: user.membershipCard ? JSON.parse(JSON.stringify(user.membershipCard)) : null,
        createdAt: user.createdAt,
      });
    });

    return userMap;
  } catch (error) {
    console.error('Error fetching users details:', error);
    return new Map();
  }
}
