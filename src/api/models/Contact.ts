import {
  DataTypes,
  Model,
  Optional,
  Association,
} from 'sequelize';
import { sequelize } from '../../sequelize.js'; // Adjust path as needed

// Optional attributes for creating new instances
interface ContactAttributes {
  id: number;
  email: string | null;
  phoneNumber: number | null;
  linkedId: number | null;  // foreign key to another Contact
  linkPrecedence: 'primary' | 'secondary';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface ContactCreationAttributes
  extends Optional<ContactAttributes, 'id' | 'linkedId' | 'email' | 'phoneNumber'> {}

export class Contact extends Model<ContactAttributes, ContactCreationAttributes>
  implements ContactAttributes {
  public id!: number;
  public email!: string | null;
  public phoneNumber!: number | null;
  public linkedId!: number | null;
  public linkPrecedence!: 'primary' | 'secondary';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  // association
  public readonly linkedContact?: Contact;
  public static associations: {
    linkedContact: Association<Contact, Contact>;
  };
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    linkedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    linkPrecedence: {
      type: DataTypes.ENUM('primary', 'secondary'),
      allowNull: false,
      defaultValue: 'primary',
    },
  },
  {
    sequelize,
    tableName: 'Contacts',
    modelName: 'Contact',
    timestamps: true,
    paranoid: true, // enables deletedAt
  }
);

// Set up the self-referencing association
Contact.belongsTo(Contact, {
  foreignKey: 'linkedId',
  as: 'linkedContact',
});
