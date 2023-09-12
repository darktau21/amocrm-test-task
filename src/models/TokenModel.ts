import { DataType, Model } from 'sequelize-typescript';
import { AllowNull, Column, Table } from 'sequelize-typescript';

@Table
class Token extends Model {
  @AllowNull(false)
  @Column(DataType.TEXT('long'))
  declare access: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare expiresIn: null;

  @AllowNull(false)
  @Column(DataType.TEXT('long'))
  declare refresh: string;
}

export async function getTokens() {
  const res = await Token.findAll();

  if (res === null) throw new Error();

  return res[0];
}

export default Token;
