import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  // rename to `password` — will store bcrypt hash
  @Column()
  password: string;

  // optional: timestamps, roles, etc.
}
