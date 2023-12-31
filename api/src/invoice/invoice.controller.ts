import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, readFileSync } from 'fs';
import { diskStorage } from 'multer';
import { Response } from'express'
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  async list(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('text') text: string,
    @Query('where') where: any,
    @Query('orderBy') orderBy: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.invoiceService.listInvoices({
      skip: parseInt(skip),
      take: parseInt(take),
      text:
        text && text !== 'null'
          ? text
          : null,
      startDate:
        startDate && startDate !== 'null'
          ? new Date(startDate).toISOString()
          : null,
      endDate:
        endDate && endDate !== 'null'
          ? new Date(endDate).toISOString()
          : null,
      where:
        where && where !== 'null'
          ? JSON.parse(where)
          : {},
      orderBy:
        orderBy && orderBy !== 'null'
          ? JSON.parse(orderBy)
          : {},
    });
  }

  @Delete()
  async deleteInvoice(@Query('id') id: any) {
    return await this.invoiceService.deleteInvoice(parseInt(id));
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp/invoices/pdf',
        filename(_req, _file, callback) {
          const filename = `${Date.now()}.pdf`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.invoiceService.processInformationPDFtoJSON(file);
    } catch (e) {
      console.error(e);
      return;
    }
  }

  @Get('/download')
  async downloadFile(@Query('filename') filename: string, @Res() res: Response) {
    try{
      if (!filename) {return}
      const fileStream = createReadStream(`./tmp/invoices/pdf/${filename}`);
  
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
      fileStream.pipe(res);
    }catch(e){
      console.error(e)
      return;
    }
  }
}
