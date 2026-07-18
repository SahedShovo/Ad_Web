import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Products } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepo: Repository<Products>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productsRepo.create(dto);
    const saved = await this.productsRepo.save(product);
    return { message: 'Product created successfully', data: saved };
  }

  async findAll() {
    const products = await this.productsRepo.find({
      order: { createdAt: 'DESC' },
    });
    return {
      message: 'Products retrieved successfully',
      count: products.length,
      data: products,
    };
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { message: 'Product retrieved successfully', data: product };
  }

  async update(id: number, dto: PartialUpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    Object.assign(product, dto);
    const updated = await this.productsRepo.save(product);
    return { message: 'Product updated successfully', data: updated };
  }

  async replace(id: number, dto: UpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const replaced = this.productsRepo.merge(product, dto);
    const saved = await this.productsRepo.save(replaced);
    return { message: 'Product replaced successfully', data: saved };
  }

  async remove(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productsRepo.delete(id);
    return { message: 'Product deleted successfully', id };
  }

  async findByCategory(category: string) {
    const products = await this.productsRepo.find({
      where: { category },
      order: { createdAt: 'DESC' },
    });
    return {
      message: `Products in category '${category}' retrieved successfully`,
      count: products.length,
      data: products,
    };
  }

  async search(keyword: string) {
    const products = await this.productsRepo.find({
      where: { name: ILike(`%${keyword}%`) },
      order: { createdAt: 'DESC' },
    });
    return {
      message: `Search results for '${keyword}'`,
      count: products.length,
      data: products,
    };
  }

  async toggleActive(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    product.isActive = !product.isActive;
    const updated = await this.productsRepo.save(product);
    return { message: 'Product status toggled successfully', data: updated };
  }
}