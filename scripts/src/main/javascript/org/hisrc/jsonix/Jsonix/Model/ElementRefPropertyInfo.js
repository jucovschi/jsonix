/*
 * Jsonix is a JavaScript library which allows you to convert between XML
 * and JavaScript object structures.
 *
 * Copyright (c) 2010 - 2014, Alexey Valikov, Highsource.org
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Alexey Valikov nor the
 *       names of contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ALEXEY VALIKOV BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

Jsonix.Model.ElementRefPropertyInfo = Jsonix
		.Class(
				Jsonix.Model.AbstractElementRefsPropertyInfo,
				{
					typeInfo : 'String',
					elementName : null,
					initialize : function(options) {
						Jsonix.Util.Ensure.ensureObject(options);
						Jsonix.Model.AbstractElementRefsPropertyInfo.prototype.initialize
								.apply(this, [ options ]);
						// TODO Ensure correct argument
						if (Jsonix.Util.Type.exists(options.typeInfo)) {
							if (Jsonix.Util.Type.isObject(options.typeInfo)) {
								Jsonix.Util.Ensure
										.ensureObject(options.typeInfo);
								this.typeInfo = options.typeInfo;
							} else {
								Jsonix.Util.Ensure
										.ensureString(options.typeInfo);
								this.typeInfo = options.typeInfo;
							}
						}
						// TODO Ensure correct argument
						if (Jsonix.Util.Type.isObject(options.elementName)) {
							this.elementName = Jsonix.XML.QName
									.fromObject(options.elementName);
						} else if (Jsonix.Util.Type
								.isString(options.elementName)) {
							this.elementName = new Jsonix.XML.QName(
									this.defaultElementNamespaceURI,
									options.elementName);
						} else {
							this.elementName = new Jsonix.XML.QName(
									this.defaultElementNamespaceURI, this.name);
						}
					},
					getPropertyElementTypeInfo : function(elementName) {
						Jsonix.Util.Ensure.ensureObject(elementName);
						Jsonix.Util.Ensure.ensureString(elementName.localPart);
						var name = Jsonix.XML.QName.fromObject(elementName);

						if (name.key === this.elementName.key) {
							return this;
						} else {
							return null;
						}
					},
					doBuild : function(context, module) {
						this.typeInfo = context.resolveTypeInfo(this.typeInfo,
								module);
					},
					buildStructureElements : function(context, structure) {
						this.buildStructureElementTypeInfos(context, structure,
								this);
					},
					CLASS_NAME : 'Jsonix.Model.ElementRefPropertyInfo'
				});
