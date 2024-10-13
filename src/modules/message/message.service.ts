import {
  Body,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, getConnection, In, QueryFailedError, QueryRunner, Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { MessageEntity } from './entity/message.entity';
import { CreateMessageDto } from './dto/maessage-create.dto';
import { classToPlain } from 'class-transformer';
import { UserI } from '../user/interface/user.interface';
import { SentMessages } from '../user/interface/user-sent-message.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async all(): Promise<any[]> {
    return await this.messageRepository.find({ select: ['id','titre','sender', 'contenu', 'dateHeureEnvoie'], relations: ['sender'] });
}


async findOne(id: number) {
  const message = this.messageRepository.findOne({where:{id}});
  if (!message) {
    throw new NotFoundException(`Message with ID ${id} not found`);
  }
  return await message;
}

async getMessagesWithUserDetails(): Promise<any[]> {
    const messages = await this.all();
    return messages.map(message => {
        const { sender, contenu, dateHeureEnvoie } = message;
        return {
            firstName: sender.first_name,
            lastName: sender.last_name,
            email: sender.email,
            content: contenu,
            sentAt: dateHeureEnvoie,
        };
    });
}
// async createMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
//   try {
//     const { senderId, titre, contenu, receivers } = createMessageDto;

//     // Utilisez findOneOrFail avec l'option { where: { id: senderId } } pour rechercher par ID
//     const sender = await this.userRepository.findOneOrFail({
//       where: { id: senderId },
//     });

//     // Utilisation de findByIds pour récupérer plusieurs destinataires par leurs IDs
//     const receiversEntities = await this.userRepository.findByIds(receivers);

//     // Filtrer les destinataires pour exclure l'utilisateur expéditeur
//     const filteredReceivers = receiversEntities.filter(receiver => receiver.id !== senderId);

//     const message = new MessageEntity();
//     message.titre = titre;
//     message.contenu = contenu;
//     message.dateHeureEnvoie = new Date();
//     message.sender = sender;
//     message.receivers = filteredReceivers;

//     return await this.messageRepository.save(message);
//   } catch (error) {
//     throw new Error(`Could not create message: ${error.message}`);
//   }
// }
// async createMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
//   try {
//     const { titre, contenu, dateHeureEnvoie, senderId, receiverIds } = createMessageDto;

//   // Vérification de l'existence de l'expéditeur
//   // Pour une version récente de TypeORM
//   const sender = await this.userRepository.findOneBy({ id: senderId });

//   if (!sender) {
//     throw new NotFoundException(`Sender with ID ${senderId} not found`);
//   }

//   // Vérification de l'existence des destinataires
//   const receivers = await this.userRepository.findByIds(receiverIds);
//   if (receivers.length !== receiverIds.length) {
//     throw new NotFoundException('One or more receivers not found');
//   }
//   console.log(receiverIds)

//   // Création du message
//   const message = this.messageRepository.create({
//     titre,
//     contenu,
//     dateHeureEnvoie :new Date(),
//     sender,
//     receivers,
//   });

//   // Sauvegarde du message avec les relations
//   console.log("message", message)
//   return this.messageRepository.save(message);
    
//   } catch (error) {
//     console.error('Error:', error.message);
//     throw new Error(`Could not create message: ${error.message}`);
//   }
// }
async createMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
  try {
      const { titre, contenu, senderId, receiverIds } = createMessageDto;

      // Vérification de l'existence de l'expéditeur
      const sender = await this.userRepository.findOne({ where: { id: senderId }});
      if (!sender) {
          throw new NotFoundException(`Sender with ID ${senderId} not found`);
      }

      // Vérification de l'existence des destinataires
      const receivers = await this.userRepository.findByIds(receiverIds);
      if (receivers.length !== receiverIds.length) {
          throw new NotFoundException('One or more receivers not found');
      }

      // Création du message
      const message = this.messageRepository.create({
          titre,
          contenu,
          dateHeureEnvoie: new Date(),
          sender,
          receivers
      });
        console.log('resception message ',message)
      // Sauvegarde du message avec les relations

      const messages =await this.messageRepository.save(message);
      console.log('message')
      return  messages

  } catch (error) {
      console.error('Error:', error);
      throw new Error(`Could not create message: ${error.message}`);
  }
}






// async getMessagesBySenders(senderIds: number[]): Promise<MessageEntity[]> {
//   return await this.messageRepository.find({
//     where: {
//       sender: {
//         id: In(senderIds)
//       }
//     },
//     relations: ['sender', 'receivers'] // Include relations if necessary
//   });
// }

// async getMessagesByReceiver(receiverId: number): Promise<MessageEntity[]> {
//   return await this.messageRepository.createQueryBuilder('message')
//     .leftJoinAndSelect('message.receivers', 'receiver')
//     .where('receiver.id = :receiverId', { receiverId })
//     .getMany();
// }

//Find a message by user
async findUserByMessageId(id: number): Promise<MessageEntity[]> {
const messages = await this.messageRepository.find({
  where: { id },
  relations: ['receivers', 'sender'],
});

if (!messages.length) {
  throw new NotFoundException(`No messages found for user with id ${id}`);
}

return messages;
} 
async getMessagesByUserId(userId: number): Promise<UserEntity> {
const user = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.receivedMessages', 'receivedMessages')
  .leftJoinAndSelect('receivedMessages.receivers', 'receivers')
  .leftJoinAndSelect('user.sentMessages', 'sentMessages')
  .leftJoinAndSelect('sentMessages.sender', 'sender')
  .where('user.id = :userId', { userId })
  .getOne();

if (!user) {
  throw new NotFoundException(`User with ID ${userId} not found`);
}

// Remove passwords from receivers
user.receivedMessages.forEach(message => {
  message.receivers.forEach(receiver => delete receiver.password);
});

return user;
}

async getUserWithSentMessages(userId: number): Promise<UserI | undefined> {
return await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.sentMessages', 'sentMessages')
  .leftJoinAndSelect('user.receiver', 'receiver') // Si vous avez un destinataire spécifique
  .where('user.id = :userId', { userId })
  .getOne();
}

async findSentMessagesByUserId(id: number): Promise<SentMessages> {
const user = await this.userRepository.findOne({
  where: { id },
  relations: ['sentMessages.sender', 'sentMessages.receivers'],
});

if (!user) {
  throw new NotFoundException(`No user found with id ${id}`);
}

const sentMessages: SentMessages = {
  sender: {
    firstName: user.first_name,
    lastName: user.last_name,
  },
  sentMessages: user.sentMessages.map(message => ({
    id: message.id,
    titre:message.titre,
    content: message.contenu, // Assurez-vous que ce champ existe dans votre entité MessageEntity
    dateHeureEnvoie : message.dateHeureEnvoie,
    receivers: message.receivers.map(receiver => ({
      id: receiver.id,
      firstName: receiver.first_name,
      lastName: receiver.last_name,
    })),
  })),
};

return sentMessages;
}

//   async all(): Promise<any[]> {
//     return await this.messageRepository.find({ select: ['id','titre','sender', 'contenu', 'dateHeureEnvoie'], relations: ['sender'] });
// }

// async createMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
//   try {
//       const { titre, contenu, senderId, receiverIds } = createMessageDto;

//       // Fetch sender
//       const sender = await this.userRepository.findOne({ where: { id: senderId }});
//       if (!sender) {
//           throw new NotFoundException(`Sender with ID ${senderId} not found`);
//       }

//       // Fetch receivers
//       const receivers = await this.userRepository.find({
//           where: { id: In(receiverIds) }
//       });
//       if (receivers.length !== receiverIds.length) {
//           throw new NotFoundException('One or more receivers not found');
//       }

//       // Create message entity
//       const message = this.messageRepository.create({
//           titre,
//           contenu,
//           dateHeureEnvoie: new Date(),
//           sender,
//           receivers
//       });

//       // Save message and relationships
//       const savedMessage = await this.messageRepository.save(message);
//       console.log('Saved Message:', savedMessage);

//       return savedMessage;

//   } catch (error) {
//       console.error('Error creating message:', error.stack || error);
//       throw new Error(`Could not create message: ${error.message}`);
//   }
// }

// async getMessagesWithUserDetails(): Promise<any[]> {
//   const messages = await this.all();
//   return messages.map(message => {
//       const { sender, contenu, dateHeureEnvoie } = message;
//       return {
//           firstName: sender.first_name,
//           lastName: sender.last_name,
//           email: sender.email,
//           content: contenu,
//           sentAt: dateHeureEnvoie,
//       };
//   });
// }





//   // async all(): Promise<any[]> {
//   //   return await this.messageRepository.find({
//   //     select: [
//   //       'id',
//   //       'titre',
//   //       'sender',
//   //       'receivers',
//   //       'contenu',
//   //       'dateHeureEnvoie',
//   //     ],
//   //     relations: ['sender', 'receivers'],
//   //   });
//   // }





 
  
//   //   // Méthode pour créer un message avec des jointures
//   //   async createMessage(createMessageDto: CreateMessageDto) {
//   //     const { titre, contenu, receiverIds, senderId, dateHeureEnvoie } = createMessageDto;
      
//   //     try {
//   //         console.log("Début de la création du message...");
//   //         console.log("Données reçues:", createMessageDto);
  
//   //         // Vérifier si l'expéditeur existe
//   //         console.log("Recherche de l'expéditeur (ID: ", senderId, ")");
//   //         const sender = await this.userRepository
//   //             .createQueryBuilder('user')
//   //             .where('user.id = :senderId', { senderId })
//   //             .getOne();
  
//   //         if (!sender) {
//   //             throw new Error(`Expéditeur avec l'ID ${senderId} introuvable`);
//   //         }
//   //         console.log("Expéditeur trouvé:", sender);
  
//   //         // Vérifier si les destinataires existent
//   //         console.log("Recherche des destinataires avec les IDs: ", receiverIds);
//   //         const receivers = await this.userRepository
//   //             .createQueryBuilder('user')
//   //             .where('user.id IN (:...receiverIds)', { receiverIds })
//   //             .getMany();
  
//   //         if (receivers.length === 0) {
//   //             throw new Error(`Aucun destinataire valide trouvé avec les IDs: ${receiverIds}`);
//   //         }
//   //         console.log("Destinataires trouvés:", receivers.map(receiver => receiver.id));
  
//   //         // Assigner la date actuelle si elle n'est pas fournie
//   //         const currentDate = dateHeureEnvoie || new Date();
//   //         console.log("Date d'envoi du message:", currentDate);
  
//   //         // Créer le message
//   //         console.log("Insertion du message dans la base de données...");
//   //         const messageInsertResult = await this.messageRepository
//   //             .createQueryBuilder()
//   //             .insert()
//   //             .into(MessageEntity)
//   //             .values({
//   //                 titre: titre,
//   //                 contenu: contenu,
//   //                 dateHeureEnvoie: currentDate,
//   //                 sender: sender, // Relation Many-to-One avec l'expéditeur
//   //             })
//   //             .returning('*') // Récupérer les détails du message inséré
//   //             .execute();
  
//   //         const messageId = messageInsertResult.identifiers[0].id;
//   //         console.log("Message inséré avec succès, ID:", messageId);
  
//   //         // Insérer les relations dans la table de jointure message_user
//   //         for (const receiver of receivers) {
//   //             console.log(`Ajout de la relation message_user pour le destinataire ID: ${receiver.id}`);
//   //             await this.messageRepository
//   //                 .createQueryBuilder()
//   //                 .relation(MessageEntity, 'receivers')
//   //                 .of(messageId) // ID du message inséré
//   //                 .add(receiver.id); // ID du destinataire
//   //             console.log(`Relation créée pour le destinataire ${receiver.id}`);
//   //         }
  
//   //         // Retourner les détails du message créé
//   //         console.log("Message créé avec succès:", {
//   //             id: messageId,
//   //             titre,
//   //             contenu,
//   //             dateHeureEnvoie: currentDate,
//   //             receivers,
//   //         });
  
//   //         return {
//   //             id: messageId,
//   //             titre,
//   //             contenu,
//   //             dateHeureEnvoie: currentDate,
//   //             receivers,
//   //         };
  
//   //     } catch (error) {
//   //         console.error("Erreur lors de la création du message:", error.message);
//   //         throw new Error(`Impossible de créer le message: ${error.message}`);
//   //     }
//   // }
  
  










//   // async createMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
//   //   const { titre, contenu, receiverIds, senderId, dateHeureEnvoie } = createMessageDto;

//   //   // Création d'un QueryRunner pour gérer la transaction
//   //   const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

//   //   // Connexion du QueryRunner
//   //   await queryRunner.connect();

//   //   // Démarrage de la transaction
//   //   await queryRunner.startTransaction();

//   //   try {
//   //     console.log("Fetching sender and receivers with QueryBuilder...");

//   //     // Récupérer l'expéditeur (sender) en utilisant QueryBuilder
//   //     const sender = await queryRunner.manager
//   //       .createQueryBuilder(UserEntity, 'user')
//   //       .where('user.id = :senderId', { senderId })
//   //       .getOne();

//   //     if (!sender) {
//   //       throw new NotFoundException(`Sender with ID ${senderId} not found`);
//   //     }

//   //     // Récupérer les destinataires (receivers) en utilisant QueryBuilder
//   //     const receivers = await queryRunner.manager
//   //       .createQueryBuilder(UserEntity, 'user')
//   //       .where('user.id IN (:...receiverIds)', { receiverIds })
//   //       .getMany();

//   //     if (receivers.length === 0) {
//   //       throw new NotFoundException(`No valid receivers found with IDs: ${receiverIds}`);
//   //     }

//   //     // Définir la date d'envoi
//   //     const sendDate = dateHeureEnvoie || new Date();

//   //     // Créer le message
//   //     const message = this.messageRepository.create({
//   //       titre,
//   //       contenu,
//   //       dateHeureEnvoie: sendDate,
//   //       sender,
//   //       receivers,  // Assignation directe des receivers
//   //     });

//   //     // Sauvegarder le message via le QueryRunner
//   //     const savedMessage = await queryRunner.manager.save(message);

//   //     console.log("Message successfully inserted with ID:", savedMessage.id);

//   //     // Commit de la transaction
//   //     await queryRunner.commitTransaction();

//   //     return savedMessage;
//   //   } catch (error) {
//   //     console.error("Error occurred while sending message:", error.message);
//   //     // Rollback de la transaction en cas d'erreur
//   //     await queryRunner.rollbackTransaction();
//   //     throw error;
//   //   } finally {
//   //     // Libération du QueryRunner
//   //     await queryRunner.release();
//   //   }
//   // }


























//   // async createMessage(
//   //   titre: string,
//   //   contenu: string,
//   //   senderId: number,
//   //   receiverIds: number[],
//   // ): Promise<MessageEntity> {
//   //   const sender = await this.userRepository.findOne({where:{id:senderId}});
//   //   if (!sender) {
//   //     throw new NotFoundException('Sender not found');
//   //   }

//   //   const receivers = await this.userRepository.findByIds(receiverIds);
//   //   if (!receivers.length) {
//   //     throw new NotFoundException('Receivers not found');
//   //   }

//   //   const message = this.messageRepository.create({
//   //     titre,
//   //     contenu,
//   //     dateHeureEnvoie: new Date(),
//   //     sender,
//   //     receivers,
//   //   });

//   //   return this.messageRepository.save(message);
//   // }

//   // Lister tous les messages reçus par un utilisateur
//   async getMessagesForUser(userId: number): Promise<MessageEntity[]> {
//     const user = await this.userRepository.findOne({
//       where: { id: userId },
//       relations: ['receivedMessages'],
//     });
  
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
  
//     return user.receivedMessages;
//   }
  

//   // Supprimer un message
//   async deleteMessage(messageId: number): Promise<void> {
//     const message = await this.messageRepository.findOne({where:{id:messageId}});
//     if (!message) {
//       throw new NotFoundException('Message not found');
//     }
//     await this.messageRepository.remove(message);
//   }



























//   // async all(): Promise<any[]> {
//   //   return await this.messageRepository.find({
//   //     select: [
//   //       'id',
//   //       'titre',
//   //       'sender',
//   //       'receivers',
//   //       'contenu',
//   //       'dateHeureEnvoie',
//   //     ],
//   //     relations: ['sender', 'receivers'],
//   //   });
//   // }

//   // //     async findOne(id: number) {
//   // //       const message = this.messageRepository.findOne({where:{id}});
//   // //       if (!message) {
//   // //         throw new NotFoundException(`Message with ID ${id} not found`);
//   // //       }
//   // //       return await message;
//   // //     }

//   // //     async getMessagesWithUserDetails(): Promise<any[]> {
//   // //         const messages = await this.all();
//   // //         return messages.map(message => {
//   // //             const { sender, contenu, dateHeureEnvoie } = message;
//   // //             return {
//   // //                 firstName: sender.first_name,
//   // //                 lastName: sender.last_name,
//   // //                 email: sender.email,
//   // //                 content: contenu,
//   // //                 sentAt: dateHeureEnvoie,
//   // //             };
//   // //         });
//   // //     }

//   //   async createMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
//   //     try {
//   //         const { titre, contenu, senderId, receiverIds } = createMessageDto;

//   //         // Vérifier l'existence de l'utilisateur expéditeur
//   //         const sender = await this.userRepository.findOne({ where: { id: senderId } });
//   //         if (!sender) {
//   //             throw new NotFoundException(`Sender with ID ${senderId} not found`);
//   //         }

//   //         // Vérifier l'existence des utilisateurs destinataires
//   //         const receivers = await this.userRepository.findByIds(receiverIds);
//   //         if (receivers.length !== receiverIds.length) {
//   //             throw new NotFoundException('One or more receivers not found');
//   //         }

//   //         // Créer un nouveau message
//   //         const message = this.messageRepository.create({
//   //             titre,
//   //             contenu,
//   //             dateHeureEnvoie: new Date(),
//   //             sender,
//   //             receivers,
//   //         });

//   //         // Sauvegarder le message
//   //         return await this.messageRepository.save(message);

//   //     } catch (error) {
//   //         // Gestion spécifique des erreurs de contrainte de clé étrangère
//   //         if (error instanceof QueryFailedError && error.message === '23503') {
//   //             throw new Error('Foreign key constraint violated. One or more receiver IDs do not exist.');
//   //         }
//   //         console.error('Error:', error);
//   //         throw new Error(`Could not create message: ${error.message}`);
//   //     }
//   // }

//   // //   //Find a message by user
//   // //   async findUserByMessageId(id: number): Promise<MessageEntity[]> {
//   // //     const messages = await this.messageRepository.find({
//   // //       where: { id },
//   // //       relations: ['receivers', 'sender'],
//   // //     });

//   // //     if (!messages.length) {
//   // //       throw new NotFoundException(`No messages found for user with id ${id}`);
//   // //     }

//   // //     return messages;
//   // //   }
//   // //   async getMessagesByUserId(userId: number): Promise<UserEntity> {
//   // //     const user = await this.userRepository
//   // //       .createQueryBuilder('user')
//   // //       .leftJoinAndSelect('user.receivedMessages', 'receivedMessages')
//   // //       .leftJoinAndSelect('receivedMessages.receivers', 'receivers')
//   // //       .leftJoinAndSelect('user.sentMessages', 'sentMessages')
//   // //       .leftJoinAndSelect('sentMessages.sender', 'sender')
//   // //       .where('user.id = :userId', { userId })
//   // //       .getOne();

//   // //     if (!user) {
//   // //       throw new NotFoundException(`User with ID ${userId} not found`);
//   // //     }

//   // //     user.receivedMessages.forEach(message => {
//   // //       message.receivers.forEach(receiver => delete receiver.password);
//   // //     });

//   // //     return user;
//   // //   }

//   // //   async getUserWithSentMessages(userId: number): Promise<UserI | undefined> {
//   // //     return await this.userRepository
//   // //       .createQueryBuilder('user')
//   // //       .leftJoinAndSelect('user.sentMessages', 'sentMessages')
//   // //       .leftJoinAndSelect('user.receiver', 'receiver')
//   // //       .where('user.id = :userId', { userId })
//   // //       .getOne();
//   // //   }

//   // //   async findSentMessagesByUserId(id: number): Promise<SentMessages> {
//   // //     const user = await this.userRepository.findOne({
//   // //       where: { id },
//   // //       relations: ['sentMessages.sender', 'sentMessages.receivers'],
//   // //     });

//   // //     if (!user) {
//   // //       throw new NotFoundException(`No user found with id ${id}`);
//   // //     }

//   // //     const sentMessages: SentMessages = {
//   // //       sender: {
//   // //         firstName: user.first_name,
//   // //         lastName: user.last_name,
//   // //       },
//   // //       sentMessages: user.sentMessages.map(message => ({
//   // //         id: message.id,
//   // //         titre:message.titre,
//   // //         content: message.contenu,
//   // //         dateHeureEnvoie : message.dateHeureEnvoie,
//   // //         receivers: message.receivers.map(receiver => ({
//   // //           id: receiver.id,
//   // //           firstName: receiver.first_name,
//   // //           lastName: receiver.last_name,
//   // //         })),
//   // //       })),
//   // //     };

//   // //     return sentMessages;
//   // //   }

//   // // Envoie d'un message
//   // async sendMessage(createMessageDto: CreateMessageDto) {
//   //   const { titre, contenu, receiverIds, senderId } = createMessageDto;
  
//   //   try {
//   //     console.log("Fetching sender and receivers with QueryBuilder...");
  
//   //     // Récupérer l'expéditeur (sender) en utilisant QueryBuilder
//   //     const sender = await this.userRepository
//   //       .createQueryBuilder('user')
//   //       .where('user.id = :senderId', { senderId })
//   //       .getOne();
  
//   //     if (!sender) {
//   //       throw new Error(`Sender with ID ${senderId} not found`);
//   //     }
  
//   //     // Récupérer les destinataires (receivers) en utilisant QueryBuilder
//   //     const receivers = await this.userRepository
//   //       .createQueryBuilder('user')
//   //       .where('user.id IN (:...receiverIds)', { receiverIds })
//   //       .getMany();
  
//   //     if (receivers.length === 0) {
//   //       throw new Error(`No valid receivers found with IDs: ${receiverIds}`);
//   //     }
  
//   //     // Si la date d'envoi n'est pas fournie, on assigne la date actuelle
//   //     const dateHeureEnvoie = createMessageDto.dateHeureEnvoie || new Date();
  
//   //     // Utilisation de QueryBuilder pour créer et insérer un nouveau message
//   //     const message = await this.messageRepository
//   //       .createQueryBuilder()
//   //       .insert()
//   //       .into(MessageEntity)
//   //       .values({
//   //         titre: titre,
//   //         contenu: contenu,
//   //         dateHeureEnvoie: dateHeureEnvoie,
//   //         sender: sender, // Relation Many-to-One avec l'expéditeur
//   //       })
//   //       .returning('*') // Récupérer les détails du message inséré
//   //       .execute();
  
//   //     const messageId = message.identifiers[0].id; // ID du message inséré
  
//   //     console.log("Message successfully inserted with ID:", messageId);
  
//   //     // Insérer les relations Many-to-Many dans la table de jointure message_user
//   //     for (const receiver of receivers) {
//   //       await this.messageRepository
//   //         .createQueryBuilder()
//   //         .relation(MessageEntity, 'receivers')
//   //         .of(messageId) // ID du message inséré
//   //         .add(receiver.id); // ID du destinataire
//   //         console.log("Receivers linked to message successfully", receiver);
//   //     }
  
//   //     console.log("Receivers linked to message successfully");
//   //     console.log(message.generatedMaps[0])
//   //     return message.generatedMaps[0]; // Retourner le message inséré
  
//   //   } catch (error) {
//   //     console.error("Error occurred while sending message:", error.message);
//   //     throw new Error(`Could not create message: ${error.message}`);
//   //   }
//   // }
  
  
//   // // Lister tous les messages
//   // async findAll(): Promise<MessageEntity[]> {
//   //   return this.messageRepository.find({ relations: ['sender', 'receivers'] });
//   // }

//   // // Lister les messages reçus par un utilisateur
//   // async findReceivedMessages(userId: number): Promise<MessageEntity[]> {
//   //   const user = await this.userRepository.findOne({
//   //     where: { id: userId },
//   //     relations: ['receivedMessages', 'receivedMessages.sender'], // Ajout de l'expéditeur
//   //   });
  
//   //   if (!user) {
//   //     throw new Error(`User with ID ${userId} not found`);
//   //   }
  
//   //   return user.receivedMessages || []; // Retourne un tableau vide si aucun message n'est trouvé
//   // }

//   // // Lister les messages envoyés par un utilisateur
//   // async findSentMessages(userId: number): Promise<MessageEntity[]> {
//   //   const user = await this.userRepository.findOne({
//   //     where: { id: userId },
//   //     relations: ['sentMessages'],
//   //   });
//   //   return user.sentMessages;
//   // }

//   // // Lister les messages par utilisateur (utilisé pour obtenir les messages envoyés et reçus d'un utilisateur)
//   // async findMessagesByUser(
//   //   userId: number,
//   // ): Promise<{ sent: MessageEntity[]; received: MessageEntity[] }> {
//   //   const user = await this.userRepository.findOne({
//   //     where: { id: userId },
//   //     relations: ['sentMessages', 'receivedMessages'],
//   //   });
//   //   return {
//   //     sent: user.sentMessages,
//   //     received: user.receivedMessages,
//   //   };
//   // }
}
